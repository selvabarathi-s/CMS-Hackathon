import {
  StudentProfile,
  Career,
  RoadmapMilestone,
  MilestoneStatus,
  NextBestAction,
  Resource
} from '../types/shared.js';
import { db } from '../db/database.js';
import { SkillGapService } from './skillGapService.js';

export class AdaptiveRoadmapService {
  public static generatePersonalizedRoadmap(profile: StudentProfile, career: Career): RoadmapMilestone[] {
    const gaps = SkillGapService.calculateSkillGaps(profile, career);
    const milestones: RoadmapMilestone[] = [];
    let orderIndex = 1;

    for (const gap of gaps) {
      const skill = db.getSkillById(gap.skillId);
      const skillResources = db.getResources().filter(r =>
        r.id.includes(gap.skillId.replace('skill-', '')) || r.title.toLowerCase().includes(gap.skillName.toLowerCase())
      );

      // Default curated resources if none specifically tagged
      const relevantResources: Resource[] = skillResources.length > 0 ? skillResources : [
        {
          id: `res-auto-${gap.skillId}-1`,
          title: `Comprehensive Guide to ${gap.skillName}`,
          type: 'article',
          provider: 'CareerBridge Knowledge Engine',
          url: `https://learn.careerbridge.io/${gap.skillId}`,
          durationMinutes: 30,
          difficulty: gap.status === 'weak' || gap.status === 'missing' ? 'beginner' : 'intermediate',
          rating: 4.8,
          whyRecommended: `Tailored for ${gap.status} proficiency level in ${gap.skillName}.`
        }
      ];

      const completedIds = profile.completedMilestoneIds || [];

      // Stage 1: LEARN (Theory & Foundational Patterns)
      let learnStatus: MilestoneStatus = 'not_started';
      if (completedIds.includes(`ms-${gap.skillId}-learn`) || gap.status === 'mastered' || gap.status === 'strong') {
        learnStatus = 'completed';
      } else if (gap.priority === 'critical' && milestones.length === 0) {
        learnStatus = 'in_progress';
      }

      milestones.push({
        id: `ms-${gap.skillId}-learn`,
        title: `Master ${gap.skillName} Core Concepts`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'learn',
        description: `Understand theoretical fundamentals, architectural standards, and core syntax for ${gap.skillName}.`,
        estimatedHours: 4,
        status: learnStatus,
        order: orderIndex++,
        resources: relevantResources,
        isRemedial: gap.status === 'weak'
      });

      // Stage 2: PRACTICE (Interactive Exercises & Drills)
      let practiceStatus: MilestoneStatus = 'locked';
      if (completedIds.includes(`ms-${gap.skillId}-practice`) || gap.status === 'mastered') {
        practiceStatus = 'completed';
      } else if (learnStatus === 'completed') {
        practiceStatus = 'in_progress';
      }

      milestones.push({
        id: `ms-${gap.skillId}-practice`,
        title: `Interactive ${gap.skillName} Problem Drills`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'practice',
        description: `Solve hands-on sandbox challenges and scenario queries to build muscle memory in ${gap.skillName}.`,
        estimatedHours: 6,
        status: practiceStatus,
        order: orderIndex++,
        resources: relevantResources.filter(r => r.type === 'interactive' || r.type === 'repo'),
        practiceExercise: {
          id: `drill-${gap.skillId}`,
          title: `${gap.skillName} Scenario Challenge`,
          prompt: `Analyze the provided dataset scenario using ${gap.skillName}. Optimize for performance and handle edge cases.`,
          hints: ['Check table joins or input conditions', 'Ensure proper indexing and clean variable scoping'],
          solution: '-- Optimal verified production query pattern'
        }
      });

      // Stage 3: BUILD (Real-World Portfolio Project)
      let buildStatus: MilestoneStatus = 'locked';
      if (completedIds.includes(`ms-${gap.skillId}-build`)) {
        buildStatus = 'completed';
      } else if (practiceStatus === 'completed') {
        buildStatus = 'in_progress';
      }

      milestones.push({
        id: `ms-${gap.skillId}-build`,
        title: `Build Portfolio Project applying ${gap.skillName}`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'build',
        description: `Design and deliver an industry-grade project demonstrating practical application of ${gap.skillName}.`,
        estimatedHours: 12,
        status: buildStatus,
        order: orderIndex++,
        resources: relevantResources,
        projectPrompt: {
          id: `proj-prompt-${gap.skillId}`,
          title: `${gap.skillName} Applied Industry Project`,
          brief: `Develop an end-to-end solution addressing a real-world workflow problem in ${career.discipline}.`,
          deliverables: ['Source Code Repository (GitHub)', 'Executive Readme & Architecture Diagram', 'Live Demo or Demo Video'],
          evaluationCriteria: ['Code quality & modularity', 'Handling of edge conditions', 'Clear documentation'],
          industryContext: `High-value portfolio piece for entry into ${career.title}.`
        }
      });

      // Stage 4: EVALUATE (Skill Mastery Assessment)
      const matchingAssessment = db.getAssessments(gap.skillId)[0];
      let evalStatus: MilestoneStatus = 'locked';
      if (completedIds.includes(`ms-${gap.skillId}-evaluate`) || gap.status === 'mastered') {
        evalStatus = 'completed';
      } else if (buildStatus === 'completed') {
        evalStatus = 'not_started';
      }

      milestones.push({
        id: `ms-${gap.skillId}-evaluate`,
        title: `Verify ${gap.skillName} Career Readiness`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'evaluate',
        description: `Take the timed benchmark evaluation to certify your skill mastery level.`,
        estimatedHours: 1,
        status: evalStatus,
        order: orderIndex++,
        resources: [],
        assessmentId: matchingAssessment ? matchingAssessment.id : undefined
      });
    }

    return milestones;
  }

  public static computeNextBestAction(profile: StudentProfile, career: Career): NextBestAction {
    const gaps = SkillGapService.calculateSkillGaps(profile, career);
    const criticalGap = gaps.find(g => g.priority === 'critical') || gaps[0];

    if (!criticalGap) {
      return {
        taskId: 'task-explore-next',
        title: 'Explore Advanced Specializations & Capstone',
        targetSkill: 'Career Mastery',
        estimatedMinutes: 30,
        reason: 'You have satisfied all core benchmark competencies for this career!',
        actionType: 'project',
        route: '/simulator'
      };
    }

    // Check if an assessment is pending
    const assessment = db.getAssessments(criticalGap.skillId)[0];
    const userAssessmentScore = profile.assessmentScores[assessment?.id || ''];

    if (assessment && userAssessmentScore === undefined) {
      return {
        taskId: `task-assess-${criticalGap.skillId}`,
        title: `Take ${criticalGap.skillName} Diagnostic`,
        targetSkill: criticalGap.skillName,
        estimatedMinutes: 15,
        reason: `Benchmark your baseline proficiency in ${criticalGap.skillName} to calibrate your learning path.`,
        actionType: 'assessment',
        route: `/assessments?id=${assessment.id}`
      };
    }

    if (criticalGap.status === 'weak') {
      return {
        taskId: `task-remedial-${criticalGap.skillId}`,
        title: `Targeted Revision: ${criticalGap.skillName} Core Drills`,
        targetSkill: criticalGap.skillName,
        estimatedMinutes: 25,
        reason: `${criticalGap.skillName} is your highest-deficit gap (${criticalGap.gapScore}% below benchmark).`,
        actionType: 'revision',
        route: `/roadmap#${criticalGap.skillId}`
      };
    }

    return {
      taskId: `task-practice-${criticalGap.skillId}`,
      title: `Hands-on Practice: ${criticalGap.skillName} Challenge`,
      targetSkill: criticalGap.skillName,
      estimatedMinutes: 20,
      reason: `Boost your practical score from ${criticalGap.currentLevel}% to the target ${criticalGap.targetLevel}%.`,
      actionType: 'practice',
      route: `/roadmap#${criticalGap.skillId}`
    };
  }

  public static adaptRoadmapOnAssessmentResult(
    profile: StudentProfile,
    assessmentId: string,
    scorePercentage: number
  ): StudentProfile {
    const assessment = db.getAssessmentById(assessmentId);
    if (!assessment) return profile;

    // Update assessment score in profile
    profile.assessmentScores[assessmentId] = scorePercentage;

    // Update skill record
    const skill = db.getSkillById(assessment.skillId);
    if (skill) {
      const existingSkill = profile.skills.find(s => s.skillId === skill.id);
      if (existingSkill) {
        existingSkill.level = scorePercentage;
        existingSkill.verified = true;
        existingSkill.lastAssessedAt = new Date().toISOString().split('T')[0];
      } else {
        profile.skills.push({
          skillId: skill.id,
          skillName: skill.name,
          level: scorePercentage,
          verified: true,
          lastAssessedAt: new Date().toISOString().split('T')[0]
        });
      }
    }

    // Recalculate Readiness Score
    let totalSkillLevel = 0;
    profile.skills.forEach(s => {
      totalSkillLevel += s.level;
    });
    const avgSkill = profile.skills.length > 0 ? Math.round(totalSkillLevel / profile.skills.length) : 50;
    const projectScore = Math.min(100, profile.projects.length * 35 + 20);
    const overall = Math.round((avgSkill * 0.55) + (projectScore * 0.25) + (profile.cgpa * 2));

    profile.readinessScore = {
      overallPercentage: Math.min(99, overall),
      technicalScore: avgSkill,
      projectScore: projectScore,
      problemSolvingScore: Math.min(100, avgSkill + 5),
      softSkillScore: 75,
      status: overall >= 80 ? 'career_ready' : overall >= 65 ? 'competent' : overall >= 45 ? 'building' : 'starting'
    };

    // Save updated profile
    db.saveProfile(profile);
    return profile;
  }
}
