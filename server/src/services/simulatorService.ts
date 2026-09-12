import { Career, StudentProfile, CareerComparisonResult, PriorityLevel } from '../types/shared.js';
import { db } from '../db/database.js';

export class SimulatorService {
  public static simulatePivot(
    profile: StudentProfile,
    sourceCareerId: string,
    targetCareerId: string
  ): CareerComparisonResult | null {
    const sourceCareer = db.getCareerById(sourceCareerId);
    const targetCareer = db.getCareerById(targetCareerId);

    if (!sourceCareer || !targetCareer) {
      return null;
    }

    const studentSkillMap = new Map<string, number>();
    profile.skills.forEach(s => studentSkillMap.set(s.skillId, s.level));

    const sourceSkillIds = new Set(sourceCareer.requiredSkillIds);
    const targetBenchmarkSkills = targetCareer.benchmark.requiredSkills;

    const transferableSkills: { skillId: string; skillName: string; proficiency: number }[] = [];
    const missingSkills: { skillId: string; skillName: string; targetLevel: number; priority: PriorityLevel }[] = [];

    let matchedSkillCount = 0;

    for (const bSkill of targetBenchmarkSkills) {
      const currentLevel = studentSkillMap.get(bSkill.skillId) || 0;
      const isOverlappingWithSource = sourceSkillIds.has(bSkill.skillId);

      if (isOverlappingWithSource || currentLevel >= 50) {
        matchedSkillCount++;
        transferableSkills.push({
          skillId: bSkill.skillId,
          skillName: bSkill.skillName,
          proficiency: currentLevel > 0 ? currentLevel : 60
        });
      } else {
        missingSkills.push({
          skillId: bSkill.skillId,
          skillName: bSkill.skillName,
          targetLevel: bSkill.targetProficiency,
          priority: bSkill.importance === 'mandatory' ? 'critical' : 'medium'
        });
      }
    }

    const overlapPercentage = Math.round((matchedSkillCount / Math.max(1, targetBenchmarkSkills.length)) * 100);

    let transitionDifficulty: 'low' | 'moderate' | 'high' = 'moderate';
    let estimatedMonths = 4;

    if (overlapPercentage >= 65) {
      transitionDifficulty = 'low';
      estimatedMonths = 2;
    } else if (overlapPercentage < 40) {
      transitionDifficulty = 'high';
      estimatedMonths = 7;
    }

    // Suitability vs Preferability
    const suitabilityScore = Math.min(95, Math.round(overlapPercentage * 0.7 + (profile.cgpa * 3)));
    const preferabilityScore = Math.min(98, Math.round(suitabilityScore * 0.85 + (targetCareer.growthRate.includes('36%') ? 15 : 10)));

    // Pivot Roadmap steps
    const pivotRoadmapSummary = [
      {
        step: 1,
        title: `Audit Transferable Competencies (${transferableSkills.map(s => s.skillName).slice(0, 2).join(', ')})`,
        durationWeeks: 2
      },
      {
        step: 2,
        title: `Bridge Priority Skill Gap: ${missingSkills[0]?.skillName || 'Target Domain Fundamentals'}`,
        durationWeeks: transitionDifficulty === 'high' ? 6 : 4
      },
      {
        step: 3,
        title: `Build Transition Portfolio Project for ${targetCareer.title}`,
        durationWeeks: 4
      },
      {
        step: 4,
        title: `Complete ${targetCareer.title} Benchmark Assessment & Certification`,
        durationWeeks: 2
      }
    ];

    const rationale = `Transition from ${sourceCareer.title} to ${targetCareer.title} has a ${overlapPercentage}% skill synergy. You bring transferable capabilities in ${transferableSkills.map(s => s.skillName).join(', ') || 'foundational problem solving'}, requiring an estimated ${estimatedMonths} months of focused bridge learning.`;

    return {
      sourceCareer,
      targetCareer,
      skillOverlapPercentage: overlapPercentage,
      transferableSkills,
      missingSkills,
      transitionDifficulty,
      estimatedMonths,
      suitabilityScore,
      preferabilityScore,
      pivotRoadmapSummary,
      rationale
    };
  }
}
