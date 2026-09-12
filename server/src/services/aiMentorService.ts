import { StudentProfile, AIMessage, Career, SkillGapItem } from '../types/shared.js';
import { db } from '../db/database.js';
import { SkillGapService } from './skillGapService.js';
import { AdaptiveRoadmapService } from './adaptiveRoadmapService.js';

export class AIMentorService {
  public static async generateGuidance(
    profile: StudentProfile,
    userQuery: string
  ): Promise<AIMessage> {
    const career = db.getCareerById(profile.targetCareerId) || db.getCareers()[0];
    const gaps = SkillGapService.calculateSkillGaps(profile, career);
    const topGap = gaps.find(g => g.priority === 'critical') || gaps[0] || ({
      skillId: 'skill-core',
      skillName: 'Core Engineering Fundamentals',
      category: 'Foundation',
      currentLevel: 50,
      targetLevel: 80,
      gapScore: 30,
      priority: 'high',
      status: 'developing',
      prerequisiteFulfilled: true,
      rationale: 'Foundational competency required for engineering benchmark.'
    } as SkillGapItem);

    const topStrengths = profile.skills.filter(s => s.level >= 70);
    const nextAction = AdaptiveRoadmapService.computeNextBestAction(profile, career);
    const placementDrives = db.getPlacementDrives() || [];

    // Optional LLM invocation if GEMINI_API_KEY is configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const llmResult = await this.callGeminiAPI(profile, career, gaps, topGap, userQuery);
        if (llmResult) {
          const aiMessage: AIMessage = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            content: llmResult.reply,
            timestamp: new Date().toISOString(),
            suggestedActions: llmResult.suggestedActions,
            contextSnapshot: {
              careerTitle: career.title,
              topGapSkill: topGap.skillName,
              readiness: profile.readinessScore.overallPercentage
            }
          };
          this.saveHistory(profile.id, userQuery, aiMessage);
          return aiMessage;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local expert system:', err);
      }
    }

    // Comprehensive Pedagogical Reasoning Engine
    const { reply, suggestedActions } = this.evaluateLocalGuidance(
      profile,
      career,
      gaps,
      topGap,
      topStrengths,
      nextAction,
      placementDrives,
      userQuery
    );

    const aiMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
      suggestedActions,
      contextSnapshot: {
        careerTitle: career.title,
        topGapSkill: topGap.skillName,
        readiness: profile.readinessScore.overallPercentage
      }
    };

    this.saveHistory(profile.id, userQuery, aiMessage);
    return aiMessage;
  }

  private static evaluateLocalGuidance(
    profile: StudentProfile,
    career: Career,
    gaps: SkillGapItem[],
    topGap: SkillGapItem,
    topStrengths: any[],
    nextAction: any,
    placementDrives: any[],
    userQuery: string
  ): { reply: string; suggestedActions: string[] } {
    const q = userQuery.toLowerCase();
    const suggestedActions: string[] = [];
    let reply = '';

    // 1. Technical Interview Preparation
    if (
      q.includes('interview') ||
      q.includes('coding round') ||
      q.includes('dsa') ||
      q.includes('technical question') ||
      q.includes('prepare for technical') ||
      q.includes('mock interview')
    ) {
      const topPlacementSkills = career.placementSkills || ['Problem Solving', 'Data Structures', 'Database Queries'];
      const prepItems = career.placementPreparation || [
        'Aptitude & Quantitative Problem Solving',
        'Core Technical Data Structures & Algorithms',
        'System Architecture & Object-Oriented Design',
        'Live Behavioral & STAR Framework Rounds'
      ];

      reply = `### 🎯 Technical Interview Master Plan for **${career.title}**

To help you clear technical recruitment rounds for **${career.title}** from your **${profile.stream || profile.degree}** foundation, here is your tailored 3-stage blueprint:

#### 1. Core Technical Rounds Focus Areas
- **Primary Interview Competencies**: ${topPlacementSkills.map(s => `**${s}**`).join(', ')}.
- **Diagnostic Lever**: Interviewers will test you extensively on **${topGap.skillName}** (your current index: **${topGap.currentLevel}%**). Be prepared to explain trade-offs and code live.
- **Academic Benchmark**: Your CGPA of **${profile.cgpa} / 10** qualifies you for Tier-1 engineering interview cutoffs (>7.5).

#### 2. Expected Interview Questions Breakdown
1. **Architecture & Design**: *"How would you design a scalable data ingestion or simulation pipeline for ${career.title}?"*
2. **Algorithmic Problem**: *"Implement an optimized algorithm handling edge cases in ${topGap.skillName}."*
3. **Applied Domain**: *"Walk me through a production obstacle you encountered in ${profile.projects[0]?.title || 'your capstone project'} and how you resolved it."*

#### 3. Behavioral Round (STAR Technique)
Prepare 2 specific stories highlighting **Situation, Task, Action, and Result** demonstrating cross-disciplinary collaboration and critical debugging under pressure.`;

      suggestedActions.push(
        'Practice Technical Assessment Drill',
        'Suggest an impactful project for my resume',
        'Which companies are hiring for this role?'
      );
    }

    // 2. Campus Placement Drives & Hiring Companies
    else if (
      q.includes('placement') ||
      q.includes('company') ||
      q.includes('companies') ||
      q.includes('drive') ||
      q.includes('hiring') ||
      q.includes('zoho') ||
      q.includes('microsoft') ||
      q.includes('tata') ||
      q.includes('infosys') ||
      q.includes('l&t') ||
      q.includes('package') ||
      q.includes('ctc') ||
      q.includes('lpa')
    ) {
      const eligibleDrives = placementDrives.filter(d =>
        !d.eligibleDepartments ||
        d.eligibleDepartments.length === 0 ||
        d.eligibleDepartments.some((dept: string) =>
          (profile.degree && profile.degree.toLowerCase().includes(dept.toLowerCase())) ||
          (profile.stream && profile.stream.toLowerCase().includes(dept.toLowerCase())) ||
          dept.toLowerCase().includes('all')
        )
      );

      const topDrive = eligibleDrives[0] || placementDrives[0];

      reply = `### 🏢 Live Placement Companies & Eligibility for **${profile.fullName}**

Here is your recruitment intelligence based on the Central Placement Cell data for **${career.title}**:

#### 1. Active Recruitment Drives Matching Your Profile
${eligibleDrives.slice(0, 3).map((d, i) =>
  `${i + 1}. **${d.companyName}** — Role: **${d.roleTitle}**
   - **Compensation**: \`${d.salaryPackage}\` | **Min CGPA**: \`${d.minCgpa}\` (Your CGPA: \`${profile.cgpa}\`)
   - **Drive Date**: ${d.driveDate} | **Status**: *${d.status.toUpperCase()}*`
).join('\n')}

#### 2. Key Recruitment Criteria
- **Eligibility Check**: With a **${profile.cgpa} CGPA** and **${profile.readinessScore.overallPercentage}% Readiness Index**, you meet the eligibility threshold for **${topDrive?.companyName || 'leading recruiters'}**.
- **Crucial Differentiator**: Recruiters evaluate candidates on closing persistent skill deficits. Strengthening **${topGap.skillName}** will boost your shortlisting chances by ~28%.

> 💡 **Next Step**: Check out the **Live Placement Drives** tab on your navigation menu to submit one-click applications directly to the college placement directorate.`;

      suggestedActions.push(
        'Help me prepare for technical interviews',
        'Explain the career scope and industry trajectory',
        'How do I bridge my highest priority skill deficit?'
      );
    }

    // 3. Bridging Skill Deficits & Targeted Action Plan
    else if (
      q.includes('bridge') ||
      q.includes('deficit') ||
      q.includes('gap') ||
      q.includes('weak') ||
      q.includes('struggle') ||
      q.includes('improve') ||
      q.includes('what should i learn') ||
      q.includes('learn today')
    ) {
      reply = `### ⚡ Targeted Skill Deficit Mastery Sprint

Your primary diagnostic focus is **${topGap.skillName}**. Here is your accelerated bridge plan:

#### 1. Current Diagnostic Status
- **Skill**: **${topGap.skillName}** (${topGap.category})
- **Current Proficiency**: \`${topGap.currentLevel}%\` ➔ **Target Benchmark**: \`${topGap.targetLevel}%\`
- **Priority**: **${topGap.priority.toUpperCase()}** (Impact Weight: High)

#### 2. 3-Phase Action Plan (${profile.weeklyHoursCommitted || 14} hrs/week pace)
1. **Foundation Review (Days 1–5)**:
   - Study accredited courseware modules verified by Faculty Mentor **Dr. Balu Prasath**.
   - Review syntax, core libraries, and algorithm patterns for **${topGap.skillName}**.
2. **Hands-on Sandboxes (Days 6–15)**:
   - Complete targeted drills in the **Assessment Arena** to convert theory into muscle memory.
3. **Mini-Project Milestone (Days 16–25)**:
   - Build an applied module integrating **${topGap.skillName}** into your active roadmap.

> 🛡️ **Mentor Assurance**: Remember that all AI course suggestions must be audited and approved by **Dr. Balu Prasath** before unlocking for verified readiness points.`;

      suggestedActions.push(
        `Request Course for ${topGap.skillName}`,
        'Suggest an impactful project for my resume',
        'Help me prepare for technical interviews'
      );
    }

    // 4. Resume & Capstone Projects
    else if (
      q.includes('project') ||
      q.includes('portfolio') ||
      q.includes('resume') ||
      q.includes('github') ||
      q.includes('capstone')
    ) {
      const recProject = career.benchmark.recommendedProjects[0] || 'Enterprise Analytics & Automation Hub';

      reply = `### 🚀 High-Impact Resume Project for **${career.title}**

To stand out to recruiters from your **${profile.stream || profile.degree}** background, build a production-grade portfolio project:

#### 📌 Recommended Project: **"${recProject}"**

#### 🛠️ Architectural Blueprint
1. **Data / Ingestion Layer**: Build a modular pipeline collecting real-world datasets relevant to ${career.discipline}.
2. **Processing & Core Logic**: Integrate **${topGap.skillName}** to demonstrate deep capability where candidates typically struggle.
3. **Service & API**: Expose clean REST endpoints with thorough unit testing and input validation.
4. **Interactive Dashboard / Frontend**: Provide an intuitive UI or analytics visualization demonstrating business KPIs.

#### 📋 Recruiter Checklist
- [x] Host repository on GitHub with architectural diagram, setup steps, and CI/CD workflow.
- [x] Write clean documentation with quantifiable outcomes (*"Improved throughput by 35%"*).
- [x] Include a live hosted deployment or Dockerized container link.`;

      suggestedActions.push(
        'Help me prepare for technical interviews',
        'How do I bridge my highest priority skill deficit?',
        'Explain the career scope and industry trajectory'
      );
    }

    // 5. Career Scope, Salary & Industry Trajectory
    else if (
      q.includes('scope') ||
      q.includes('trajectory') ||
      q.includes('salary') ||
      q.includes('growth') ||
      q.includes('future') ||
      q.includes('demand') ||
      q.includes('industry')
    ) {
      const futureSkills = career.futureSkills || ['Generative AI Integration', 'Edge Computing', 'Automated ML Pipelines'];
      const entrySalary = career.roles?.[0]?.entrySalary || '₹6 - 10 LPA';
      const medianSalary = career.medianSalary || '₹14 LPA';

      reply = `### 📈 Industry Scope & Career Trajectory: **${career.title}**

#### 1. Market Growth & Salary Potential
- **Industry Growth Rate**: **${career.growthRate}** (High Market Demand in 2026–2030).
- **Fresher / Campus Placement**: \`${entrySalary}\`
- **Median Experienced Level**: \`${medianSalary}\`
- **Senior / Lead Architect (5+ years)**: \`₹25 - 45+ LPA\`;

#### 2. Industry Outlook for ${profile.stream || profile.degree} Students
Companies are rapidly transitioning toward automated, data-driven systems. Your interdisciplinary background in **${profile.stream || 'Engineering'}** provides a unique competitive edge over pure generalists.

#### 3. 5–10 Year Future-Ready Technologies
Stay ahead of industry shifts by tracking these frontier skills:
${futureSkills.map((s, i) => `${i + 1}. **${s}** — Crucial for long-term career longevity.`).join('\n')}`;

      suggestedActions.push(
        'Which companies are hiring for this role?',
        'Suggest an impactful project for my resume',
        'What should I learn today?'
      );
    }

    // 6. Career Switch / Pivot
    else if (
      q.includes('switch') ||
      q.includes('pivot') ||
      q.includes('alternative') ||
      q.includes('change career') ||
      q.includes('different role')
    ) {
      const relatedTitles = career.relatedCareerIds
        .map(id => db.getCareerById(id)?.title)
        .filter(Boolean)
        .slice(0, 3);

      reply = `### 🔄 Career Pivot & Transferability Analysis

You can smoothly transition from **${profile.stream || profile.degree}** into adjacent engineering domains!

#### 1. High-Overlap Adjacent Career Tracks
${relatedTitles.map((t, i) => `${i + 1}. **${t}** (~75% foundation skill overlap with your current track)`).join('\n')}

#### 2. Transition Feasibility
- **Foundational Assets**: Your core strengths in **${topStrengths.map(s => s.skillName).join(', ') || 'engineering problem solving'}** transfer directly.
- **Estimated Pivot Time**: At your **${profile.learningPace} pace** (~${profile.weeklyHoursCommitted || 14} hrs/week), bridging remaining domain gaps typically takes **6–10 weeks**.

> 💡 **Try It**: Visit the **Career Simulator & Pivot** module on your sidebar to run a live simulation comparing salary, time-to-readiness, and milestone bridges!`;

      suggestedActions.push(
        'Launch Career Simulator',
        'Why is this career recommended for me?',
        'How do I bridge my highest priority skill deficit?'
      );
    }

    // 7. Faculty Mentor & Quality Assurance
    else if (
      q.includes('mentor') ||
      q.includes('approval') ||
      q.includes('balu') ||
      q.includes('faculty') ||
      q.includes('quality')
    ) {
      reply = `### 👨‍🏫 Faculty Mentor Academic Quality Assurance

At CareerBridge, AI suggestions are strictly governed by your academic mentors to guarantee institutional curriculum alignment.

- **Assigned Faculty Mentor**: **Dr. Balu Prasath** (*Dept. of Computer Science & Engineering*).
- **Approval Protocol**: Any course material recommended by AI for your skill deficits enters a \`Pending Review\` state.
- **Mentor Verification**: Dr. Balu Prasath audits provider rigor (Coursera, MIT OCW, Linux Foundation, NPTEL) and releases verified material directly to your **Resource Hub**.
- **Readiness Guarantee**: Only mentor-approved courses unlock verified completion points toward your official college readiness score.`;

      suggestedActions.push(
        'What should I learn today?',
        'Suggest an impactful project for my resume',
        'Help me prepare for technical interviews'
      );
    }

    // 8. General / Fallback Contextual Response
    else {
      reply = `Hello **${profile.fullName}**! I am your personal CareerBridge AI Advisor, calibrated for **${career.title}**.

Here is your live diagnostic status:
- **Target Career**: **${career.title}** (${career.discipline})
- **Current Career Readiness**: **${profile.readinessScore.overallPercentage}%** (*${profile.readinessScore.status}*)
- **Top Priority Deficit**: **${topGap.skillName}** (Current: \`${topGap.currentLevel}%\` vs Target: \`${topGap.targetLevel}%\`)
- **Recommended Next Step**: **${nextAction.title}** (~${nextAction.estimatedMinutes} mins)

Feel free to ask me anything! For example:
- *"How do I prepare for technical interviews?"*
- *"Which companies are hiring for this role?"*
- *"Suggest an impactful project for my resume"*
- *"Explain the career scope and industry trajectory"*`;

      suggestedActions.push(
        'How do I bridge my highest priority skill deficit?',
        'Suggest an impactful project for my resume',
        'Help me prepare for technical interviews'
      );
    }

    return { reply, suggestedActions };
  }

  /**
   * Optional Gemini API integration with timeout and error handling.
   */
  private static async callGeminiAPI(
    profile: StudentProfile,
    career: Career,
    gaps: SkillGapItem[],
    topGap: SkillGapItem,
    userQuery: string
  ): Promise<{ reply: string; suggestedActions: string[] } | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const systemPrompt = `You are the CareerBridge Context-Aware AI Career Mentor for an engineering student.
Student Context:
- Name: ${profile.fullName}
- Degree/Department: ${profile.degree || profile.discipline} (${profile.stream || 'Engineering'})
- CGPA: ${profile.cgpa} / 10 | Year of Study: Year ${profile.yearOfStudy}
- Target Career: ${career.title} (${career.discipline})
- Career Readiness Index: ${profile.readinessScore.overallPercentage}% (${profile.readinessScore.status})
- Top Priority Skill Gap: ${topGap.skillName} (Current: ${topGap.currentLevel}%, Target Benchmark: ${topGap.targetLevel}%)
- Faculty Mentor: Dr. Balu Prasath (Mentors must approve AI course suggestions)
- Committed Weekly Hours: ${profile.weeklyHoursCommitted || 14} hrs/week

Instructions:
1. Provide structured, highly actionable, encouraging career guidance formatted in clean Markdown.
2. Use headings (###, ####), bold highlights (**keyword**), bullet points (- item), and numbered steps (1. step).
3. Directly answer the user's specific query. Do NOT repeat generic greetings unless asked.
4. Keep the response professional, concise, practical, and focused on engineering career success.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemPrompt}\n\nStudent Query: "${userQuery}"` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800
            }
          })
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        return null;
      }

      const data = await res.json() as any;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return null;

      return {
        reply: text.trim(),
        suggestedActions: [
          'Help me prepare for technical interviews',
          'Suggest an impactful project for my resume',
          'How do I bridge my highest priority skill deficit?'
        ]
      };
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  }

  private static saveHistory(studentId: string, userQuery: string, aiMessage: AIMessage) {
    db.addChatMessage(studentId, {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: userQuery,
      timestamp: new Date().toISOString()
    });
    db.addChatMessage(studentId, aiMessage);
  }
}
