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

export interface RoadmapAdaptationContext {
  mode: 'fast_track' | 'remedial_support' | 'placement_calibrated' | 'future_ready';
  modeLabel: string;
  modeDescription: string;
  totalMilestones: number;
  completedCount: number;
  completionPercentage: number;
  totalEstimatedHours: number;
  remainingHours: number;
  projectedWeeksToReadiness: number;
  fastTrackCount: number;
  remedialCount: number;
  futureReadyCount: number;
  weeklyHoursCommitted: number;
  pace: string;
  velocity?: number;
  completedMilestones?: number;
  projectedWeeks?: number;
}

export class AdaptiveRoadmapService {
  public static generatePersonalizedRoadmap(profile: StudentProfile, career: Career): RoadmapMilestone[] {
    const gaps = SkillGapService.calculateSkillGaps(profile, career);
    const milestones: RoadmapMilestone[] = [];
    const completedIds = profile.completedMilestoneIds || [];
    const assessmentScores = profile.assessmentScores || {};

    // Dynamic pace scaling multiplier
    const paceMultiplier = profile.learningPace === 'intensive' ? 0.75 :
                           profile.learningPace === 'accelerated' ? 0.85 : 1.0;

    let orderIndex = 1;
    let hasInProgress = false;

    // Phase 1, 2, 3: For each required skill competency
    for (const gap of gaps) {
      const existingSkill = profile.skills.find(s => s.skillId === gap.skillId);
      const isHighProficiency = existingSkill && existingSkill.level >= 75 && existingSkill.verified;
      const isCriticalDeficit = gap.status === 'weak' || gap.status === 'missing';
      const diagnosticAssessment = db.getAssessments(gap.skillId)[0];
      const hasTakenDiagnostic = diagnosticAssessment && assessmentScores[diagnosticAssessment.id] !== undefined;
      const diagnosticScore = hasTakenDiagnostic ? assessmentScores[diagnosticAssessment.id] : undefined;

      // Extract matching curated resources from database
      const allRes = db.getResources();
      const skillResources = allRes.filter(r =>
        r.id.includes(gap.skillId.replace('skill-', '')) ||
        r.title.toLowerCase().includes(gap.skillName.toLowerCase()) ||
        r.whyRecommended?.toLowerCase().includes(gap.skillName.toLowerCase())
      );

      // Attach direct external resources from career catalog if available
      const careerLinks = (career.learningResources || []).map((lr, i) => ({
        id: `res-career-${gap.skillId}-${i}`,
        title: `${lr.title}: Curated Platform`,
        type: 'course' as const,
        provider: lr.title,
        url: lr.url,
        durationMinutes: 90,
        difficulty: 'intermediate' as const,
        rating: 4.9,
        whyRecommended: `Cited in industry benchmarks for ${career.title}.`,
        embedType: 'external' as const
      }));

      const relevantResources: Resource[] = skillResources.length > 0
        ? [...skillResources, ...careerLinks].slice(0, 4)
        : careerLinks.length > 0
        ? careerLinks.slice(0, 3)
        : [
            {
              id: `res-auto-${gap.skillId}-1`,
              title: `Industry Guide & Syntax Standards for ${gap.skillName}`,
              type: 'article',
              provider: 'CareerBridge Engineering Catalog',
              url: `https://learn.careerbridge.io/${gap.skillId}`,
              durationMinutes: 30,
              difficulty: isCriticalDeficit ? 'beginner' : 'intermediate',
              rating: 4.8,
              whyRecommended: `Calibrated for ${gap.status} proficiency level in ${gap.skillName}.`
            }
          ];

      // --- STAGE 1: LEARN (Academic & Core Foundation) ---
      const learnId = `ms-${gap.skillId}-learn`;
      let learnStatus: MilestoneStatus = 'not_started';
      let learnAdaptationReason: string | undefined = undefined;

      if (completedIds.includes(learnId) || gap.status === 'mastered') {
        learnStatus = 'completed';
      } else if (isHighProficiency) {
        // Dynamic Diagnostic Bypass
        learnStatus = 'completed';
        learnAdaptationReason = '⚡ Fast-Tracked: Verified baseline proficiency (>75%) in diagnostic evaluation';
      } else if (!hasInProgress) {
        learnStatus = 'in_progress';
        hasInProgress = true;
      }

      milestones.push({
        id: learnId,
        title: `Core Curriculum & Foundations: ${gap.skillName}`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'learn',
        phase: 'core_foundation',
        description: `Master core architectural patterns, theoretical principles, and standard syntax for ${gap.skillName}. Informed by ${career.coreCourses ? career.coreCourses.slice(0, 2).join(' & ') : 'department curriculum'}.`,
        estimatedHours: Math.max(2, Math.round(4 * paceMultiplier)),
        status: learnStatus,
        order: orderIndex++,
        resources: relevantResources,
        isRemedial: false,
        adaptationReason: learnAdaptationReason
      });

      // --- DYNAMIC REMEDIAL BOOSTER INJECTION (Performance Driven) ---
      if (isCriticalDeficit || (diagnosticScore !== undefined && diagnosticScore < 65)) {
        const remedialId = `ms-remedial-${gap.skillId}`;
        let remedialStatus: MilestoneStatus = 'locked';

        if (completedIds.includes(remedialId)) {
          remedialStatus = 'completed';
        } else if (learnStatus === 'completed') {
          if (!hasInProgress) {
            remedialStatus = 'in_progress';
            hasInProgress = true;
          } else {
            remedialStatus = 'not_started';
          }
        }

        milestones.push({
          id: remedialId,
          title: `Diagnostic Remedial Booster: ${gap.skillName} Reinforcement`,
          skillId: gap.skillId,
          skillName: gap.skillName,
          stage: 'practice',
          phase: 'core_foundation',
          description: `Targeted conceptual reinforcement scheduled dynamically based on performance deficit (${diagnosticScore !== undefined ? diagnosticScore + '%' : gap.gapScore + '% deficit'}). Focuses on step-by-step problem deconstruction.`,
          estimatedHours: Math.max(2, Math.round(3 * paceMultiplier)),
          status: remedialStatus,
          order: orderIndex++,
          resources: relevantResources.filter(r => r.type === 'interactive' || r.type === 'documentation'),
          isRemedial: true,
          adaptationReason: '🛡️ Remedial Booster: Scheduled dynamically based on deficit gap in diagnostic assessment'
        });
      }

      // --- STAGE 2: PRACTICE (Placement & Technical Interview Drills) ---
      const practiceId = `ms-${gap.skillId}-practice`;
      let practiceStatus: MilestoneStatus = 'locked';

      if (completedIds.includes(practiceId) || gap.status === 'mastered') {
        practiceStatus = 'completed';
      } else if (learnStatus === 'completed') {
        if (!hasInProgress) {
          practiceStatus = 'in_progress';
          hasInProgress = true;
        } else {
          practiceStatus = 'not_started';
        }
      }

      milestones.push({
        id: practiceId,
        title: `Placement & Technical Interview Drills: ${gap.skillName}`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'practice',
        phase: 'placement_preparation',
        description: `Solve timed algorithmic scenarios, debugging drills, and technical interview questions for ${gap.skillName}. Aligned with campus recruitment benchmarks.`,
        estimatedHours: Math.max(3, Math.round(6 * paceMultiplier)),
        status: practiceStatus,
        order: orderIndex++,
        resources: relevantResources.filter(r => r.type === 'interactive' || r.type === 'repo' || r.type === 'course'),
        practiceExercise: {
          id: `drill-${gap.skillId}`,
          title: `${gap.skillName} Industry Drill Scenario`,
          prompt: `Implement a production-grade routine for ${gap.skillName} addressing standard edge conditions and latency constraints in ${career.discipline}.`,
          hints: ['Consider memory complexity and modular encapsulation', 'Validate input bounds and sanitize parameters'],
          solution: '// Verified production implementation pattern'
        },
        adaptationReason: '🎯 Placement Preparation: Benchmark exercises aligned with top recruiting firms'
      });

      // --- STAGE 3: BUILD (Real-World Portfolio Project) ---
      const buildId = `ms-${gap.skillId}-build`;
      let buildStatus: MilestoneStatus = 'locked';

      if (completedIds.includes(buildId)) {
        buildStatus = 'completed';
      } else if (practiceStatus === 'completed') {
        if (!hasInProgress) {
          buildStatus = 'in_progress';
          hasInProgress = true;
        } else {
          buildStatus = 'not_started';
        }
      }

      milestones.push({
        id: buildId,
        title: `Deliver Production Project: Applied ${gap.skillName}`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'build',
        phase: 'portfolio_build',
        description: `Architect and publish an end-to-end repository demonstrating applied engineering proficiency in ${gap.skillName}.`,
        estimatedHours: Math.max(6, Math.round(10 * paceMultiplier)),
        status: buildStatus,
        order: orderIndex++,
        resources: relevantResources,
        projectPrompt: {
          id: `proj-prompt-${gap.skillId}`,
          title: `${gap.skillName} Production Capstone Brief`,
          brief: `Deliver a fully documented software or hardware engineering subsystem solving a real operational challenge in ${career.title}.`,
          deliverables: [
            'GitHub Repository with modular source code and CI checks',
            'Architecture diagram & system README with setup instructions',
            'Live demo link, video walkthrough, or test coverage report'
          ],
          evaluationCriteria: [
            'Architectural correctness & clean code standards',
            'Robustness under failure modes & boundary tests',
            'Clarity of documentation and API schemas'
          ],
          industryContext: `High-value portfolio artifact tailored for ${career.title} recruitment.`
        }
      });

      // --- STAGE 4: EVALUATE (Career Readiness Diagnostic) ---
      const evalId = `ms-${gap.skillId}-evaluate`;
      let evalStatus: MilestoneStatus = 'locked';
      let evalAdaptation: string | undefined = undefined;

      if (completedIds.includes(evalId) || (diagnosticScore !== undefined && diagnosticScore >= 75)) {
        evalStatus = 'completed';
        if (diagnosticScore !== undefined) {
          evalAdaptation = `Certified with ${diagnosticScore}% diagnostic score`;
        }
      } else if (buildStatus === 'completed') {
        evalStatus = 'not_started';
      }

      milestones.push({
        id: evalId,
        title: `Career Readiness Assessment: ${gap.skillName}`,
        skillId: gap.skillId,
        skillName: gap.skillName,
        stage: 'evaluate',
        phase: 'placement_preparation',
        description: `Verify technical mastery through timed scenario multiple-choice and code comprehension assessments.`,
        estimatedHours: 1,
        status: evalStatus,
        order: orderIndex++,
        resources: [],
        assessmentId: diagnosticAssessment ? diagnosticAssessment.id : undefined,
        adaptationReason: evalAdaptation
      });
    }

    // --- PHASE 4: DYNAMIC FUTURE-READY SPECIALIZATION INJECTION ---
    const readinessScore = profile.readinessScore?.overallPercentage || 50;
    const futureSkills = career.futureSkills || ['GenAI & Edge AI Automation', 'Distributed Cloud Architecture'];

    if (futureSkills.length > 0) {
      const futureId = `ms-future-${career.id}`;
      let futureStatus: MilestoneStatus = 'locked';
      let futureReason: string = 'Locked until baseline readiness reaches 65%';

      if (completedIds.includes(futureId)) {
        futureStatus = 'completed';
      } else if (readinessScore >= 75) {
        futureStatus = 'in_progress';
        futureReason = `🚀 Future-Ready Track: Unlocked dynamically based on achieving ${readinessScore}% career readiness`;
      } else if (readinessScore >= 60) {
        futureStatus = 'not_started';
        futureReason = `🚀 Emerging Industry Skill: Unlocked as an advanced elective (${readinessScore}% readiness)`;
      }

      milestones.push({
        id: futureId,
        title: `Future-Ready Specialization: ${futureSkills[0]}`,
        skillId: 'skill-future-tech',
        skillName: futureSkills[0],
        stage: 'build',
        phase: 'future_ready',
        description: `Explore frontier technologies (${futureSkills.slice(0, 3).join(', ')}) identified with "${career.futureRelevance || 'Very High'}" market relevance in industry benchmarks.`,
        estimatedHours: Math.max(8, Math.round(12 * paceMultiplier)),
        status: futureStatus,
        order: orderIndex++,
        resources: (career.learningResources || []).slice(0, 3).map((lr, idx) => ({
          id: `res-future-${idx}`,
          title: lr.title,
          type: 'course' as const,
          provider: lr.title,
          url: lr.url,
          durationMinutes: 120,
          difficulty: 'advanced' as const,
          rating: 4.9,
          whyRecommended: `Next-gen skill platform cited for future relevance in ${career.title}.`,
          embedType: 'external' as const
        })),
        isFutureReady: true,
        adaptationReason: futureReason
      });
    }

    // --- INDUSTRY CAPSTONE SHOWCASE ---
    const capstoneId = `ms-capstone-${career.id}`;
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    let capstoneStatus: MilestoneStatus = 'locked';

    if (completedIds.includes(capstoneId)) {
      capstoneStatus = 'completed';
    } else if (completedCount >= Math.floor(milestones.length * 0.7)) {
      capstoneStatus = 'in_progress';
    }

    milestones.push({
      id: capstoneId,
      title: `Final Capstone Showcase & Placement Portfolio Verification`,
      skillId: 'skill-capstone',
      skillName: 'Enterprise Capstone',
      stage: 'build',
      phase: 'portfolio_build',
      description: `Synthesize all project deliverables, benchmark certifications, and architecture case studies into a unified recruitment dossier.`,
      estimatedHours: Math.max(10, Math.round(16 * paceMultiplier)),
      status: capstoneStatus,
      order: orderIndex++,
      resources: [],
      adaptationReason: '🎓 Placement Final Stage: Dossier review with Faculty Mentor'
    });

    return milestones;
  }

  public static getAdaptationContext(profile: StudentProfile, milestones: RoadmapMilestone[]): RoadmapAdaptationContext {
    const totalMilestones = milestones.length;
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    const completionPercentage = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

    let totalEstimatedHours = 0;
    let remainingHours = 0;
    let fastTrackCount = 0;
    let remedialCount = 0;
    let futureReadyCount = 0;

    milestones.forEach(m => {
      totalEstimatedHours += m.estimatedHours;
      if (m.status !== 'completed') {
        remainingHours += m.estimatedHours;
      }
      if (m.adaptationReason && m.adaptationReason.includes('Fast-Tracked')) {
        fastTrackCount++;
      }
      if (m.isRemedial) {
        remedialCount++;
      }
      if (m.isFutureReady) {
        futureReadyCount++;
      }
    });

    const weeklyHours = profile.weeklyHoursCommitted || 12;
    const projectedWeeksToReadiness = Math.max(1, Math.ceil(remainingHours / weeklyHours));

    let mode: RoadmapAdaptationContext['mode'] = 'placement_calibrated';
    let modeLabel = '🎯 Placement-Calibrated Track';
    let modeDescription = 'Roadmap milestones balanced for systematic placement readiness and coursework alignment.';

    if (fastTrackCount > 0 && profile.readinessScore.overallPercentage >= 75) {
      mode = 'fast_track';
      modeLabel = '⚡ Fast-Track Diagnostic Mode';
      modeDescription = `${fastTrackCount} foundational milestones bypassed based on verified diagnostic proficiency. Directing focus to advanced drills and project deliverables.`;
    } else if (remedialCount > 0) {
      mode = 'remedial_support';
      modeLabel = '🛡️ Remedial Reinforcement Active';
      modeDescription = `${remedialCount} targeted booster modules dynamically scheduled to reinforce foundational concepts and close persistent score deficits.`;
    } else if (profile.readinessScore.overallPercentage >= 70) {
      mode = 'future_ready';
      modeLabel = '🚀 Future-Ready Mastery Track';
      modeDescription = 'High baseline competence unlocked next-generation industry electives (GenAI, Edge AI, Digital Twins) to maximize placement competitiveness.';
    }

    const pace = profile.targetTimeline || profile.learningPace || 'accelerated';
    const paceMultiplier = pace === 'intensive' ? 0.75 : pace === 'accelerated' ? 0.85 : 1.0;
    const velocity = paceMultiplier === 0.75 ? 1.5 : paceMultiplier === 0.85 ? 1.2 : 1.0;

    return {
      mode,
      modeLabel,
      modeDescription,
      velocity,
      totalMilestones,
      completedCount,
      completedMilestones: completedCount,
      completionPercentage,
      totalEstimatedHours,
      remainingHours,
      projectedWeeks: projectedWeeksToReadiness,
      projectedWeeksToReadiness,
      fastTrackCount,
      remedialCount,
      futureReadyCount,
      weeklyHoursCommitted: weeklyHours,
      pace: profile.targetTimeline || profile.learningPace || 'accelerated'
    };
  }

  public static computeNextBestAction(profile: StudentProfile, career: Career): NextBestAction {
    const gaps = SkillGapService.calculateSkillGaps(profile, career);
    const criticalGap = gaps.find(g => g.priority === 'critical') || gaps[0];

    if (!criticalGap) {
      return {
        taskId: 'task-explore-next',
        title: 'Explore Future-Ready Specializations & Capstone',
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
        existingSkill.verified = scorePercentage >= 65;
        existingSkill.lastAssessedAt = new Date().toISOString().split('T')[0];
      } else {
        profile.skills.push({
          skillId: skill.id,
          skillName: skill.name,
          level: scorePercentage,
          verified: scorePercentage >= 65,
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
