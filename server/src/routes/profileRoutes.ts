import { Router } from 'express';
import { db } from '../db/database.js';
import { SkillGapService } from '../services/skillGapService.js';

export const profileRouter = Router();

// Get profile by ID
profileRouter.get('/:id', (req, res) => {
  const profile = db.getProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const targetCareer = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
  const skillGaps = SkillGapService.calculateSkillGaps(profile, targetCareer);

  res.json({
    profile,
    targetCareer,
    skillGaps
  });
});

// Update profile & dynamic recalculation
profileRouter.put('/:id', (req, res) => {
  const profile = db.getProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const updates = req.body;
  const updatedProfile = {
    ...profile,
    ...updates
  };

  // Dynamic recalculation of readiness score
  let totalSkillLevel = 0;
  updatedProfile.skills.forEach((s: { level: number }) => {
    totalSkillLevel += s.level;
  });
  const avgSkill = updatedProfile.skills.length > 0 ? Math.round(totalSkillLevel / updatedProfile.skills.length) : 50;
  const projectScore = Math.min(100, updatedProfile.projects.length * 35 + 20);
  const overall = Math.round((avgSkill * 0.55) + (projectScore * 0.25) + (updatedProfile.cgpa * 2));

  updatedProfile.readinessScore = {
    overallPercentage: Math.min(99, overall),
    technicalScore: avgSkill,
    projectScore: projectScore,
    problemSolvingScore: Math.min(100, avgSkill + 5),
    softSkillScore: 75,
    status: overall >= 80 ? 'career_ready' : overall >= 65 ? 'competent' : overall >= 45 ? 'building' : 'starting'
  };

  db.saveProfile(updatedProfile);

  const targetCareer = db.getCareerById(updatedProfile.targetCareerId) || db.getCareers()[0];
  const skillGaps = SkillGapService.calculateSkillGaps(updatedProfile, targetCareer);

  res.json({
    success: true,
    profile: updatedProfile,
    targetCareer,
    skillGaps
  });
});
