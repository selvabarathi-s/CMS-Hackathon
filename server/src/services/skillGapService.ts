import { Career, StudentProfile, SkillGapItem, PriorityLevel, SkillMasteryStatus } from '../types/shared.js';
import { db } from '../db/database.js';

export class SkillGapService {
  public static calculateSkillGaps(profile: StudentProfile, targetCareer: Career): SkillGapItem[] {
    const studentSkillMap = new Map<string, number>();
    profile.skills.forEach(s => studentSkillMap.set(s.skillId, s.level));

    const gaps: SkillGapItem[] = [];

    for (const benchmarkItem of targetCareer.benchmark.requiredSkills) {
      const skill = db.getSkillById(benchmarkItem.skillId);
      const skillName = skill ? skill.name : benchmarkItem.skillName;
      const category = skill ? skill.category : 'Core Domain';
      const targetLevel = benchmarkItem.targetProficiency;
      const currentLevel = studentSkillMap.get(benchmarkItem.skillId) || 0;
      const gapScore = Math.max(0, targetLevel - currentLevel);

      let status: SkillMasteryStatus = 'missing';
      if (currentLevel >= targetLevel && currentLevel >= 85) {
        status = 'mastered';
      } else if (currentLevel >= 70) {
        status = 'strong';
      } else if (currentLevel >= 50) {
        status = 'developing';
      } else if (currentLevel >= 25) {
        status = 'weak';
      } else {
        status = 'missing';
      }

      // Check prerequisites
      let prerequisiteFulfilled = true;
      if (skill && skill.prerequisites.length > 0) {
        for (const prereqId of skill.prerequisites) {
          const prereqLevel = studentSkillMap.get(prereqId) || 0;
          if (prereqLevel < 60) {
            prerequisiteFulfilled = false;
            break;
          }
        }
      }

      let priority: PriorityLevel = 'low';
      if (benchmarkItem.importance === 'mandatory') {
        if (!prerequisiteFulfilled || currentLevel < 50) {
          priority = 'critical';
        } else if (currentLevel < targetLevel) {
          priority = 'high';
        } else {
          priority = 'medium';
        }
      } else if (benchmarkItem.importance === 'recommended') {
        if (currentLevel < 60) {
          priority = 'medium';
        } else {
          priority = 'low';
        }
      }

      let rationale = '';
      if (status === 'mastered') {
        rationale = `Mastered! Current score (${currentLevel}%) surpasses benchmark (${targetLevel}%).`;
      } else if (!prerequisiteFulfilled) {
        rationale = `Critical blocker: Prerequisites are not yet satisfied for this mandatory skill.`;
      } else if (priority === 'critical') {
        rationale = `High gap (${gapScore}% deficit) on a core mandatory competency for ${targetCareer.title}.`;
      } else if (priority === 'high') {
        rationale = `Moderate gap (${gapScore}% deficit). Requires focused practice to reach baseline hiring standards.`;
      } else {
        rationale = `Secondary enhancement skill to build competitive advantage.`;
      }

      gaps.push({
        skillId: benchmarkItem.skillId,
        skillName,
        category,
        targetLevel,
        currentLevel,
        gapScore,
        status,
        priority,
        prerequisiteFulfilled,
        rationale
      });
    }

    // Sort by priority (critical -> high -> medium -> low)
    const priorityWeight: Record<PriorityLevel, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    return gaps.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }
}
