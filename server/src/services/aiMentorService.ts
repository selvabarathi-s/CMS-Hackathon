import { StudentProfile, AIMessage } from '../types/shared.js';
import { db } from '../db/database.js';
import { SkillGapService } from './skillGapService.js';

export class AIMentorService {
  public static async generateGuidance(
    profile: StudentProfile,
    userQuery: string
  ): Promise<AIMessage> {
    const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
    const gaps = SkillGapService.calculateSkillGaps(profile, career);
    const topGap = gaps.find(g => g.priority === 'critical') || gaps[0];
    const topStrengths = profile.skills.filter(s => s.level >= 70);

    const queryLower = userQuery.toLowerCase();
    let reply = '';
    const suggestedActions: string[] = [];

    if (queryLower.includes('why this career') || queryLower.includes('why recommended')) {
      reply = `Based on your academic background in **${profile.stream || profile.degree}** (CGPA: ${profile.cgpa}) and reported strengths in **${topStrengths.map(s => s.skillName).join(', ') || 'foundational problem solving'}**, **${career.title}** provides an optimal multidisciplinary career trajectory. The role offers a growth rate of ${career.growthRate} with strong industry demand. Your current baseline readiness is at ${profile.readinessScore.overallPercentage}%, meaning you are in the *${profile.readinessScore.status}* phase with clear milestones to reach industry readiness.`;
      suggestedActions.push('View Skill Gap Breakdown', 'Review Benchmark Requirements', 'Check Career Alternatives');
    } else if (queryLower.includes('switch') || queryLower.includes('pivot') || queryLower.includes('alternative')) {
      reply = `You can definitely pivot from **${profile.stream || profile.discipline}**! Your foundation transfers directly into adjacent tracks like ${career.relatedCareerIds.map(id => db.getCareerById(id)?.title).filter(Boolean).join(' or ')}. I recommend running a scenario in our **Career Simulator** to inspect exact month-by-month bridge roadmaps.`;
      suggestedActions.push('Launch Career Simulator', 'Compare with AI Engineer', 'Compare with AgTech Specialist');
    } else if (queryLower.includes('project') || queryLower.includes('portfolio') || queryLower.includes('resume')) {
      const recProject = career.benchmark.recommendedProjects[0] || 'Real-time Analytics Dashboard';
      reply = `To stand out to recruiters for **${career.title}** from your **${profile.stream || profile.degree}** background, I recommend building: **"${recProject}"**.\n\nKey execution checklist:\n1. Solve a real domain problem bridging ${profile.stream || 'your domain'} with industry standards.\n2. Apply **${topGap?.skillName || 'core tools'}** to demonstrate capability where candidates typically struggle.\n3. Publish code with a clean README, architectural diagram, and deployment link.`;
      suggestedActions.push('View Project Brief in Roadmap', 'Explore GitHub Starters', 'Take Project Checkpoint Quiz');
    } else if (queryLower.includes('weak') || queryLower.includes('struggle') || queryLower.includes('gap') || queryLower.includes('next')) {
      reply = `Your primary growth focus right now is **${topGap?.skillName || 'Core Competency'}** (currently at ${topGap?.currentLevel || 40}% vs target ${topGap?.targetLevel || 80}%).\n\n**Action Plan (${profile.weeklyHoursCommitted || 10} hrs/week pace):**\n1. Complete the targeted **${topGap?.skillName} Practice Drills** (estimated 25 mins).\n2. Build a mini scenario project before moving to advanced concepts.\n3. Take the diagnostic evaluation to verify your new benchmark score.`;
      suggestedActions.push(`Practice ${topGap?.skillName}`, 'Ask for Code Example', 'Review Diagnostic Test');
    } else {
      reply = `Hello ${profile.fullName}! As your CareerBridge Mentor, I'm tracking your roadmap for **${career.title}** tailored to your **${profile.stream || profile.degree}** background.\n\nYou are currently **${profile.readinessScore.overallPercentage}% Career-Ready** (${profile.readinessScore.status}) committing ~${profile.weeklyHoursCommitted || 10} hrs/week. Your fastest lever to unlock the next milestone is closing the gap in **${topGap?.skillName}**.\n\nHow can I help you today? You can ask me to explain why this path fits you, suggest high-impact resume projects, or generate practice scenarios.`;
      suggestedActions.push('What should I learn today?', 'Why is this career recommended for me?', 'Recommend a standout project');
    }

    const aiMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
      suggestedActions,
      contextSnapshot: {
        careerTitle: career.title,
        topGapSkill: topGap?.skillName,
        readiness: profile.readinessScore.overallPercentage
      }
    };

    // Save to chat history
    db.addChatMessage(profile.id, {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: userQuery,
      timestamp: new Date().toISOString()
    });
    db.addChatMessage(profile.id, aiMessage);

    return aiMessage;
  }
}
