import { Router } from 'express';
import { db } from '../db/database.js';
import { CourseRecommendation, Resource, NotificationItem } from '../types/shared.js';

export const recommendationRouter = Router();

// GET /api/recommendations - List course recommendations
recommendationRouter.get('/', (req, res) => {
  const { studentId, status } = req.query;
  const recs = db.getCourseRecommendations({
    studentId: studentId as string | undefined,
    status: status as string | undefined
  });
  res.json({ recommendations: recs });
});

// GET /api/recommendations/:id - Get specific recommendation
recommendationRouter.get('/:id', (req, res) => {
  const rec = db.getCourseRecommendationById(req.params.id);
  if (!rec) {
    return res.status(404).json({ error: 'Course recommendation not found' });
  }
  res.json({ recommendation: rec });
});

// Helper for AI course catalog matching based on skill gap and discipline
function generateAICourseDetails(skillGapName: string, discipline: string, careerTitle: string) {
  const lower = (skillGapName + ' ' + careerTitle).toLowerCase();

  if (lower.includes('deep learning') || lower.includes('pytorch') || lower.includes('neural')) {
    return {
      courseTitle: 'Deep Learning with PyTorch & Neural Networks',
      provider: 'DeepLearning.AI / Coursera',
      courseUrl: 'https://www.coursera.org/specializations/deep-learning',
      type: 'course' as const,
      durationMinutes: 720,
      difficulty: 'intermediate' as const,
      rating: 4.9,
      aiRationale: `AI detected benchmark gap in tensor ops and convolutional architectures for ${careerTitle}. DeepLearning.AI delivers rigorous hands-on assignments.`
    };
  } else if (lower.includes('kubernetes') || lower.includes('cloud') || lower.includes('devops') || lower.includes('docker')) {
    return {
      courseTitle: 'Kubernetes Cloud Native Architecture & Operator Patterns',
      provider: 'Linux Foundation Training',
      courseUrl: 'https://training.linuxfoundation.org/',
      type: 'interactive' as const,
      durationMinutes: 480,
      difficulty: 'advanced' as const,
      rating: 4.8,
      aiRationale: `AI assessment indicated need for declarative infrastructure orchestration and microservices fault tolerance for ${careerTitle}.`
    };
  } else if (lower.includes('sql') || lower.includes('data') || lower.includes('database')) {
    return {
      courseTitle: 'Advanced Relational Database Optimization & Analytics',
      provider: 'Udacity Enterprise / Coursera',
      courseUrl: 'https://www.coursera.org/specializations/data-engineering-foundations',
      type: 'interactive' as const,
      durationMinutes: 360,
      difficulty: 'intermediate' as const,
      rating: 4.8,
      aiRationale: `AI flagged query execution plan bottlenecks. This module provides focused indexing, window functions, and partitioning drills.`
    };
  } else if (lower.includes('security') || lower.includes('forensic') || lower.includes('soc') || lower.includes('malware')) {
    return {
      courseTitle: 'Hands-on Enterprise Incident Response & Threat Hunting',
      provider: 'Cybrary Defense Labs',
      courseUrl: 'https://www.cybrary.it',
      type: 'interactive' as const,
      durationMinutes: 420,
      difficulty: 'advanced' as const,
      rating: 4.9,
      aiRationale: `AI simulated incident benchmark showed gap in memory forensics and rootkit analysis required for ${careerTitle}.`
    };
  } else if (lower.includes('dsp') || lower.includes('signal') || lower.includes('biomedical') || lower.includes('embedded')) {
    return {
      courseTitle: 'Digital Signal Processing & Real-Time Embedded Systems',
      provider: 'MIT OpenCourseWare / edX',
      courseUrl: 'https://ocw.mit.edu',
      type: 'course' as const,
      durationMinutes: 540,
      difficulty: 'intermediate' as const,
      rating: 4.9,
      aiRationale: `AI benchmark detected need for real-time sensor filtering, Fourier analysis, and embedded C firmware integration.`
    };
  } else if (lower.includes('robotics') || lower.includes('ros') || lower.includes('automation')) {
    return {
      courseTitle: 'ROS 2 Robotics Middleware & Autonomous Navigation',
      provider: 'ConstructSim / edX',
      courseUrl: 'https://www.edx.org',
      type: 'interactive' as const,
      durationMinutes: 450,
      difficulty: 'advanced' as const,
      rating: 4.85,
      aiRationale: `AI identified kinematic transform and SLAM mapping gaps essential for industrial robotics placement benchmarks.`
    };
  } else {
    return {
      courseTitle: `Industry Masterclass: Applied ${skillGapName}`,
      provider: 'National Programme on Technology Enhanced Learning (NPTEL) / Coursera',
      courseUrl: 'https://nptel.ac.in',
      type: 'course' as const,
      durationMinutes: 400,
      difficulty: 'intermediate' as const,
      rating: 4.8,
      aiRationale: `AI identified a core competency deficit in ${skillGapName}. This accredited university courseware builds foundational mastery.`
    };
  }
}

// POST /api/recommendations/request - Student triggers AI recommendation for a skill gap
recommendationRouter.post('/request', (req, res) => {
  const {
    studentId,
    skillGapName,
    courseTitle,
    provider,
    courseUrl,
    type,
    durationMinutes,
    difficulty,
    aiRationale
  } = req.body;

  if (!studentId || !skillGapName) {
    return res.status(400).json({ error: 'studentId and skillGapName are required' });
  }

  const profile = db.getProfileById(studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const career = db.getCareerById(profile.targetCareerId);
  const careerTitle = career ? career.title : 'Engineering Specialist';

  const defaultDetails = generateAICourseDetails(skillGapName, profile.discipline, careerTitle);

  const recommendation: CourseRecommendation = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    studentId: profile.id,
    studentName: profile.fullName,
    studentEmail: profile.email,
    department: profile.degree || profile.discipline,
    targetCareer: careerTitle,
    skillGapName: skillGapName,
    courseTitle: courseTitle || defaultDetails.courseTitle,
    provider: provider || defaultDetails.provider,
    courseUrl: courseUrl || defaultDetails.courseUrl,
    type: type || defaultDetails.type,
    durationMinutes: durationMinutes || defaultDetails.durationMinutes,
    difficulty: difficulty || defaultDetails.difficulty,
    rating: defaultDetails.rating,
    aiRationale: aiRationale || defaultDetails.aiRationale,
    status: 'pending_approval',
    requestedAt: new Date().toISOString()
  };

  db.saveCourseRecommendation(recommendation);

  // Notify Faculty Mentor (Dr. Balu Prasath)
  const mentorNotif: NotificationItem = {
    id: `notif-${Date.now()}-1`,
    userId: 'user-mentor-1',
    title: 'New AI Courseware Approval Pending',
    message: `${profile.fullName} has a new AI course recommendation for "${skillGapName}". Academic clearance required.`,
    type: 'mentor',
    read: false,
    createdAt: new Date().toISOString().split('T')[0],
    link: '/mentor'
  };
  db.addNotification(mentorNotif);

  // Notify Student
  const studentNotif: NotificationItem = {
    id: `notif-${Date.now()}-2`,
    userId: profile.userId || profile.id,
    title: 'AI Course Recommendation Queued',
    message: `AI identified "${recommendation.courseTitle}" for your ${skillGapName} gap. Submitted to Dr. Balu Prasath for academic verification.`,
    type: 'curriculum',
    read: false,
    createdAt: new Date().toISOString().split('T')[0],
    link: '/resources'
  };
  db.addNotification(studentNotif);

  res.status(201).json({
    success: true,
    recommendation
  });
});

// PUT /api/recommendations/:id/approve - Faculty Mentor approves course recommendation
recommendationRouter.put('/:id/approve', (req, res) => {
  const rec = db.getCourseRecommendationById(req.params.id);
  if (!rec) {
    return res.status(404).json({ error: 'Course recommendation not found' });
  }

  const { mentorId, mentorName, mentorFeedback } = req.body;
  const verifiedMentorName = mentorName || 'Dr. Balu Prasath';

  rec.status = 'approved';
  rec.mentorId = mentorId || 'user-mentor-1';
  rec.mentorName = verifiedMentorName;
  rec.mentorFeedback = mentorFeedback || 'Academically audited and approved for student career progression.';
  rec.reviewedAt = new Date().toISOString();

  db.saveCourseRecommendation(rec);

  // Register in Resource collection as verified courseware
  const verifiedResource: Resource = {
    id: `res-rec-${rec.id}`,
    title: rec.courseTitle,
    type: rec.type,
    provider: rec.provider,
    url: rec.courseUrl,
    durationMinutes: rec.durationMinutes,
    difficulty: rec.difficulty,
    rating: rec.rating,
    whyRecommended: `Approved by ${verifiedMentorName}: ${rec.aiRationale}`,
    embedType: 'external',
    approvalStatus: 'approved',
    approvedByMentorName: verifiedMentorName,
    approvedAt: rec.reviewedAt,
    aiRationale: rec.aiRationale
  };
  db.saveResource(verifiedResource);

  // Send Notification to Student
  const studentProfile = db.getProfileById(rec.studentId);
  const studentNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    userId: studentProfile?.userId || rec.studentId,
    title: 'AI Course Material Approved!',
    message: `${verifiedMentorName} approved "${rec.courseTitle}". It is now unlocked in your Resource Hub!`,
    type: 'mentor',
    read: false,
    createdAt: new Date().toISOString().split('T')[0],
    link: '/resources'
  };
  db.addNotification(studentNotif);

  res.json({
    success: true,
    recommendation: rec,
    resource: verifiedResource
  });
});

// PUT /api/recommendations/:id/reject - Faculty Mentor rejects course recommendation
recommendationRouter.put('/:id/reject', (req, res) => {
  const rec = db.getCourseRecommendationById(req.params.id);
  if (!rec) {
    return res.status(404).json({ error: 'Course recommendation not found' });
  }

  const { mentorId, mentorName, mentorFeedback } = req.body;
  const verifiedMentorName = mentorName || 'Dr. Balu Prasath';

  rec.status = 'rejected';
  rec.mentorId = mentorId || 'user-mentor-1';
  rec.mentorName = verifiedMentorName;
  rec.mentorFeedback = mentorFeedback || 'Prerequisite concepts require strengthening before undertaking this module.';
  rec.reviewedAt = new Date().toISOString();

  db.saveCourseRecommendation(rec);

  // Notify student of mentor decision and feedback
  const studentProfile = db.getProfileById(rec.studentId);
  const studentNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    userId: studentProfile?.userId || rec.studentId,
    title: 'Courseware Recommendation Review Note',
    message: `${verifiedMentorName} reviewed "${rec.courseTitle}": ${rec.mentorFeedback}`,
    type: 'mentor',
    read: false,
    createdAt: new Date().toISOString().split('T')[0],
    link: '/resources'
  };
  db.addNotification(studentNotif);

  res.json({
    success: true,
    recommendation: rec
  });
});
