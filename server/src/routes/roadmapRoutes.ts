import { Router } from 'express';
import { db } from '../db/database.js';
import { AdaptiveRoadmapService } from '../services/adaptiveRoadmapService.js';
import { SkillGapService } from '../services/skillGapService.js';

export const roadmapRouter = Router();

// Get personalized roadmap and next action for student
roadmapRouter.get('/:studentId', (req, res) => {
  const profile = db.getProfileById(req.params.studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
  const milestones = AdaptiveRoadmapService.generatePersonalizedRoadmap(profile, career);
  const nextAction = AdaptiveRoadmapService.computeNextBestAction(profile, career);
  const skillGaps = SkillGapService.calculateSkillGaps(profile, career);

  res.json({
    career,
    milestones,
    nextAction,
    skillGaps,
    readiness: profile.readinessScore
  });
});

// Update milestone status (e.g. mark practice completed or unlock next stage)
roadmapRouter.post('/:studentId/milestones/:milestoneId/status', (req, res) => {
  const { status } = req.body;
  const profile = db.getProfileById(req.params.studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const milestoneId = req.params.milestoneId;
  if (!profile.completedMilestoneIds) {
    profile.completedMilestoneIds = [];
  }

  if (status === 'completed') {
    if (!profile.completedMilestoneIds.includes(milestoneId)) {
      profile.completedMilestoneIds.push(milestoneId);
    }

    // Extract skillId and stage from milestoneId (ms-[skillId]-[stage])
    const parts = milestoneId.split('-');
    const stage = parts[parts.length - 1]; // learn, practice, build, evaluate
    const skillId = milestoneId.replace(/^ms-/, '').replace(new RegExp(`-${stage}$`), '');

    const existingSkill = profile.skills.find(s => s.skillId === skillId);
    const boost = stage === 'learn' ? 15 : stage === 'practice' ? 20 : stage === 'build' ? 25 : 30;
    const floor = stage === 'learn' ? 65 : stage === 'practice' ? 80 : 90;

    if (existingSkill) {
      existingSkill.level = Math.min(100, Math.max(existingSkill.level + boost, floor));
      existingSkill.lastAssessedAt = new Date().toISOString().split('T')[0];
      if (stage === 'build' || stage === 'evaluate') {
        existingSkill.verified = true;
      }
    } else {
      const skill = db.getSkillById(skillId);
      profile.skills.push({
        skillId,
        skillName: skill ? skill.name : skillId,
        level: floor,
        verified: stage === 'build' || stage === 'evaluate',
        lastAssessedAt: new Date().toISOString().split('T')[0]
      });
    }

    // If build stage is completed, award a verified project to portfolio
    if (stage === 'build') {
      const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
      const skill = db.getSkillById(skillId);
      const skillName = skill ? skill.name : skillId;
      if (!profile.projects.some(p => p.id === `proj-${skillId}`)) {
        profile.projects.push({
          id: `proj-${skillId}`,
          title: `${skillName} Production Showcase`,
          description: `Applied industry implementation verifying practical capability in ${skillName} for ${career.title}.`,
          technologies: [skillName, 'Git', 'Production Deployment'],
          verified: true
        });
      }
    }
  } else {
    profile.completedMilestoneIds = profile.completedMilestoneIds.filter(id => id !== milestoneId);
  }

  // Recalculate readiness dynamically
  let totalSkillLevel = 0;
  profile.skills.forEach(s => {
    totalSkillLevel += s.level;
  });
  const avgSkill = profile.skills.length > 0 ? Math.round(totalSkillLevel / profile.skills.length) : 50;
  const projectScore = Math.min(100, profile.projects.length * 25 + 25);
  const milestoneBonus = Math.min(20, (profile.completedMilestoneIds.length * 3));
  const overall = Math.round((avgSkill * 0.5) + (projectScore * 0.25) + (profile.cgpa * 1.5) + milestoneBonus);

  profile.readinessScore = {
    overallPercentage: Math.min(99, overall),
    technicalScore: avgSkill,
    projectScore,
    problemSolvingScore: Math.min(100, avgSkill + 8),
    softSkillScore: 75,
    status: overall >= 80 ? 'career_ready' : overall >= 65 ? 'competent' : overall >= 45 ? 'building' : 'starting'
  };

  db.saveProfile(profile);

  const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
  const milestones = AdaptiveRoadmapService.generatePersonalizedRoadmap(profile, career);
  const nextAction = AdaptiveRoadmapService.computeNextBestAction(profile, career);
  const skillGaps = SkillGapService.calculateSkillGaps(profile, career);

  res.json({
    success: true,
    milestones,
    nextAction,
    readiness: profile.readinessScore,
    skillGaps,
    profile
  });
});

// Get curated resources for student with completion states
roadmapRouter.get('/:studentId/resources', (req, res) => {
  const profile = db.getProfileById(req.params.studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
  const allResources = db.getResources();

  // Filter resources relevant to career discipline or target skills
  const careerSkillIds = career.benchmark.requiredSkills.map(s => s.skillId);
  const curated = allResources.filter(r => {
    return careerSkillIds.some(sid => r.id.includes(sid.replace('skill-', ''))) ||
      r.whyRecommended?.toLowerCase().includes(career.discipline.toLowerCase()) ||
      true; // show rich catalog
  });

  res.json({
    resources: curated,
    completedResourceIds: profile.completedResourceIds || [],
    careerTitle: career.title,
    discipline: career.discipline
  });
});

// Toggle course / learning resource completion
roadmapRouter.post('/:studentId/resources/:resourceId/complete', (req, res) => {
  const profile = db.getProfileById(req.params.studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  if (!profile.completedResourceIds) {
    profile.completedResourceIds = [];
  }

  const resourceId = req.params.resourceId;
  const isCompleted = profile.completedResourceIds.includes(resourceId);

  if (isCompleted) {
    profile.completedResourceIds = profile.completedResourceIds.filter(id => id !== resourceId);
  } else {
    profile.completedResourceIds.push(resourceId);

    // Boost matching skill level
    const resource = db.getResourceById(resourceId);
    if (resource) {
      const matchingSkill = db.getSkills().find(s =>
        resource.id.includes(s.id.replace('skill-', '')) ||
        resource.title.toLowerCase().includes(s.name.toLowerCase())
      );
      if (matchingSkill) {
        const userSkill = profile.skills.find(s => s.skillId === matchingSkill.id);
        if (userSkill) {
          userSkill.level = Math.min(100, userSkill.level + 12);
          userSkill.lastAssessedAt = new Date().toISOString().split('T')[0];
        } else {
          profile.skills.push({
            skillId: matchingSkill.id,
            skillName: matchingSkill.name,
            level: 65,
            verified: false,
            lastAssessedAt: new Date().toISOString().split('T')[0]
          });
        }
      }
    }
  }

  // Recalculate readiness
  let totalSkillLevel = 0;
  profile.skills.forEach(s => {
    totalSkillLevel += s.level;
  });
  const avgSkill = profile.skills.length > 0 ? Math.round(totalSkillLevel / profile.skills.length) : 50;
  const projectScore = Math.min(100, profile.projects.length * 25 + 25);
  const resBonus = Math.min(15, (profile.completedResourceIds.length * 3));
  const overall = Math.round((avgSkill * 0.5) + (projectScore * 0.25) + (profile.cgpa * 1.5) + resBonus);

  profile.readinessScore = {
    overallPercentage: Math.min(99, overall),
    technicalScore: avgSkill,
    projectScore,
    problemSolvingScore: Math.min(100, avgSkill + 6),
    softSkillScore: 75,
    status: overall >= 80 ? 'career_ready' : overall >= 65 ? 'competent' : overall >= 45 ? 'building' : 'starting'
  };

  db.saveProfile(profile);

  res.json({
    success: true,
    isCompleted: !isCompleted,
    completedResourceIds: profile.completedResourceIds,
    readiness: profile.readinessScore,
    profile
  });
});
