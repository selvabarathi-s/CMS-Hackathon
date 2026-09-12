import { Router } from 'express';
import { db } from '../db/database.js';

export const adminRouter = Router();

// Institutional analytics & curriculum gaps
adminRouter.get('/analytics', (req, res) => {
  const profiles = db.getProfiles();
  const careers = db.getCareers();
  const gaps = db.getCurriculumGaps();

  // Calculate career distribution
  const careerDistribution: Record<string, number> = {};
  profiles.forEach(p => {
    const c = careers.find(car => car.id === p.targetCareerId);
    const title = c ? c.title : 'General Track';
    careerDistribution[title] = (careerDistribution[title] || 0) + 1;
  });

  // Calculate department readiness average
  const disciplineReadiness: Record<string, { total: number; count: number; avg: number }> = {};
  profiles.forEach(p => {
    if (!disciplineReadiness[p.discipline]) {
      disciplineReadiness[p.discipline] = { total: 0, count: 0, avg: 0 };
    }
    disciplineReadiness[p.discipline].total += p.readinessScore.overallPercentage;
    disciplineReadiness[p.discipline].count += 1;
  });

  Object.keys(disciplineReadiness).forEach(d => {
    disciplineReadiness[d].avg = Math.round(
      disciplineReadiness[d].total / disciplineReadiness[d].count
    );
  });

  res.json({
    metrics: {
      totalStudentsEnrolled: 482,
      activeOnRoadmap: 394,
      highReadinessCount: 142,
      mentorInterventionsActive: db.getInterventions().filter(i => i.status === 'open').length,
      averageReadinessIndex: 68
    },
    careerDistribution,
    disciplineReadiness,
    curriculumGaps: gaps
  });
});

// Update or create curriculum gap action
adminRouter.post('/curriculum-gaps', (req, res) => {
  const { discipline, careerTitle, skillName, deficiencyPercentage, suggestedIntervention, priority } = req.body;
  const newGap = {
    id: `gap-${Date.now()}`,
    discipline,
    careerTitle,
    skillName,
    deficiencyPercentage: Number(deficiencyPercentage) || 60,
    studentCount: 120,
    suggestedIntervention,
    priority: priority || 'high'
  };

  db.saveCurriculumGap(newGap);
  res.json({ success: true, gap: newGap });
});
