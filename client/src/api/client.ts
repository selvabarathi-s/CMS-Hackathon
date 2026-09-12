import {
  Career,
  Skill,
  Assessment,
  Resource,
  StudentProfile,
  SkillGapItem,
  RoadmapMilestone,
  NextBestAction,
  CareerComparisonResult,
  MentorIntervention,
  CurriculumGapInsight,
  AIMessage,
  NotificationItem
} from '../../../shared/types.js';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || '/api';

export const api = {
  // Auth & Account
  async login(email: string, password?: string, portalRole?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, portalRole })
    });
    return res.json() as Promise<{
      success: boolean;
      token?: string;
      user?: any;
      profile?: StudentProfile;
      error?: string;
    }>;
  },

  async register(data: {
    fullName: string;
    email: string;
    password: string;
    discipline: string;
    stream?: string;
    specialization?: string;
    degree: string;
    yearOfStudy: number;
    cgpa?: number;
    targetCareerId?: string;
    studentId?: string;
    priorSkills?: string[];
    skillProficiencyLevel?: string;
    learningStyle?: string;
    weeklyHoursCommitted?: number;
    targetTimeline?: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{
      success: boolean;
      token?: string;
      user?: any;
      profile?: StudentProfile;
      error?: string;
    }>;
  },

  async getCredentialsGuide() {
    const res = await fetch(`${API_BASE}/auth/credentials-guide`);
    return res.json() as Promise<{ credentials: any[] }>;
  },

  async getNotifications(userId?: string) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    const res = await fetch(`${API_BASE}/auth/notifications?${params.toString()}`);
    return res.json() as Promise<{ notifications: NotificationItem[] }>;
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/auth/notifications/${id}/read`, {
      method: 'POST'
    });
    return res.json() as Promise<{ success: boolean }>;
  },

  // Careers
  async getCareers(discipline?: string, search?: string) {
    const params = new URLSearchParams();
    if (discipline && discipline !== 'all') params.append('discipline', discipline);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/careers?${params.toString()}`);
    return res.json() as Promise<{ careers: Career[] }>;
  },

  async getCareerById(id: string) {
    const res = await fetch(`${API_BASE}/careers/${id}`);
    return res.json() as Promise<{ career: Career }>;
  },

  async getSkills(discipline?: string) {
    const params = new URLSearchParams();
    if (discipline && discipline !== 'all') params.append('discipline', discipline);

    const res = await fetch(`${API_BASE}/careers/meta/skills?${params.toString()}`);
    return res.json() as Promise<{ skills: Skill[] }>;
  },

  // Profiles
  async getProfile(id: string) {
    const res = await fetch(`${API_BASE}/profiles/${id}`);
    return res.json() as Promise<{
      profile: StudentProfile;
      targetCareer: Career;
      skillGaps: SkillGapItem[];
    }>;
  },

  async updateProfile(id: string, updates: Partial<StudentProfile>) {
    const res = await fetch(`${API_BASE}/profiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json() as Promise<{
      success: boolean;
      profile: StudentProfile;
      targetCareer: Career;
      skillGaps: SkillGapItem[];
    }>;
  },

  // Assessments
  async getAssessments(skillId?: string) {
    const params = new URLSearchParams();
    if (skillId) params.append('skillId', skillId);

    const res = await fetch(`${API_BASE}/assessments?${params.toString()}`);
    return res.json() as Promise<{ assessments: Assessment[] }>;
  },

  async getAssessmentById(id: string) {
    const res = await fetch(`${API_BASE}/assessments/${id}`);
    return res.json() as Promise<{ assessment: Assessment }>;
  },

  async submitAssessment(id: string, studentId: string, answers: Record<string, number>) {
    const res = await fetch(`${API_BASE}/assessments/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, answers })
    });
    return res.json() as Promise<{
      success: boolean;
      scorePercentage: number;
      passed: boolean;
      correctCount: number;
      totalQuestions: number;
      questionResults: any[];
      updatedProfile: StudentProfile;
      updatedRoadmap: RoadmapMilestone[];
      updatedGaps: SkillGapItem[];
      nextAction: NextBestAction;
    }>;
  },

  // Roadmaps
  async getRoadmap(studentId: string) {
    const res = await fetch(`${API_BASE}/roadmaps/${studentId}`);
    return res.json() as Promise<{
      career: Career;
      milestones: RoadmapMilestone[];
      nextAction: NextBestAction;
      skillGaps: SkillGapItem[];
      readiness: any;
    }>;
  },

  async updateMilestoneStatus(studentId: string, milestoneId: string, status: string) {
    const res = await fetch(`${API_BASE}/roadmaps/${studentId}/milestones/${milestoneId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json() as Promise<{
      success: boolean;
      milestones: RoadmapMilestone[];
      nextAction: NextBestAction;
      readiness?: any;
      profile?: StudentProfile;
    }>;
  },

  async getResources(studentId: string) {
    const res = await fetch(`${API_BASE}/roadmaps/${studentId}/resources`);
    return res.json() as Promise<{
      resources: Resource[];
      completedResourceIds: string[];
      careerTitle: string;
      discipline: string;
    }>;
  },

  async completeResource(studentId: string, resourceId: string) {
    const res = await fetch(`${API_BASE}/roadmaps/${studentId}/resources/${resourceId}/complete`, {
      method: 'POST'
    });
    return res.json() as Promise<{
      success: boolean;
      isCompleted: boolean;
      completedResourceIds: string[];
      readiness?: any;
      profile?: StudentProfile;
    }>;
  },

  // Simulator
  async simulatePivot(studentId: string, sourceCareerId: string, targetCareerId: string) {
    const res = await fetch(`${API_BASE}/simulator/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, sourceCareerId, targetCareerId })
    });
    return res.json() as Promise<{ result: CareerComparisonResult }>;
  },

  // AI Mentor
  async getChatHistory(studentId: string) {
    const res = await fetch(`${API_BASE}/ai-mentor/history/${studentId}`);
    return res.json() as Promise<{ history: AIMessage[] }>;
  },

  async sendAIMessage(studentId: string, message: string) {
    const res = await fetch(`${API_BASE}/ai-mentor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, message })
    });
    return res.json() as Promise<{ message: AIMessage }>;
  },

  // Mentor Portal
  async getMentorStudents() {
    const res = await fetch(`${API_BASE}/mentor/students`);
    return res.json() as Promise<{ students: any[] }>;
  },

  async getInterventions() {
    const res = await fetch(`${API_BASE}/mentor/interventions`);
    return res.json() as Promise<{ interventions: MentorIntervention[] }>;
  },

  async createIntervention(data: { studentId: string; reason: string; notes: string; status?: string }) {
    const res = await fetch(`${API_BASE}/mentor/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{ success: boolean; intervention: MentorIntervention }>;
  },

  // Admin Portal
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    return res.json() as Promise<{
      metrics: any;
      careerDistribution: Record<string, number>;
      disciplineReadiness: Record<string, { total: number; count: number; avg: number }>;
      curriculumGaps: CurriculumGapInsight[];
    }>;
  },

  async createCurriculumGap(data: Partial<CurriculumGapInsight>) {
    const res = await fetch(`${API_BASE}/admin/curriculum-gaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json() as Promise<{ success: boolean; gap: CurriculumGapInsight }>;
  },

  // Mobile Connection
  async getMobileConnectionInfo() {
    const res = await fetch(`${API_BASE}/mobile/connection-info`);
    return res.json() as Promise<{
      localIp: string;
      clientPort: number;
      mobileAccessUrl: string;
      apkDownloadUrl: string;
      pairingCode: string;
      pwaReady: boolean;
    }>;
  }
};
