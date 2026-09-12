import { Router } from 'express';
import { db } from '../db/database.js';
import { AdaptiveRoadmapService } from '../services/adaptiveRoadmapService.js';
import { SkillGapService } from '../services/skillGapService.js';

export const assessmentRouter = Router();

// List all assessments
assessmentRouter.get('/', (req, res) => {
  const { skillId } = req.query;
  const assessments = db.getAssessments(skillId as string);
  res.json({ assessments });
});

// Get assessment by ID
assessmentRouter.get('/:id', (req, res) => {
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  res.json({ assessment });
});

// Submit assessment answers & recalculate profile and adaptive roadmap
assessmentRouter.post('/:id/submit', (req, res) => {
  const { studentId, answers } = req.body; // answers: Record<string, number> (questionId -> selectedIndex)
  const assessment = db.getAssessmentById(req.params.id);

  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const profile = db.getProfileById(studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  let correctCount = 0;
  const questionResults = assessment.questions.map(q => {
    const selected = answers ? answers[q.id] : -1;
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      question: q.question,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const scorePercentage = Math.round((correctCount / assessment.questions.length) * 100);
  const passed = scorePercentage >= assessment.passingScore;

  // Adapt student profile
  const updatedProfile = AdaptiveRoadmapService.adaptRoadmapOnAssessmentResult(
    profile,
    assessment.id,
    scorePercentage
  );

  const career = db.getCareerById(updatedProfile.targetCareerId) || db.getCareers()[0];
  const updatedRoadmap = AdaptiveRoadmapService.generatePersonalizedRoadmap(updatedProfile, career);
  const updatedGaps = SkillGapService.calculateSkillGaps(updatedProfile, career);
  const nextAction = AdaptiveRoadmapService.computeNextBestAction(updatedProfile, career);

  res.json({
    success: true,
    scorePercentage,
    passed,
    correctCount,
    totalQuestions: assessment.questions.length,
    questionResults,
    updatedProfile,
    updatedRoadmap,
    updatedGaps,
    nextAction
  });
});
