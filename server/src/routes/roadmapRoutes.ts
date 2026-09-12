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

  const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
  const milestones = AdaptiveRoadmapService.generatePersonalizedRoadmap(profile, career);
  const targetMilestone = milestones.find(m => m.id === req.params.milestoneId);

  if (targetMilestone) {
    targetMilestone.status = status;
  }

  res.json({
    success: true,
    milestones,
    nextAction: AdaptiveRoadmapService.computeNextBestAction(profile, career)
  });
});
