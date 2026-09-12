export type DisciplineType =
  | 'engineering'
  | 'agriculture'
  | 'paramedical'
  | 'commerce'
  | 'arts_science'
  | 'design_media'
  | 'law_governance'
  | 'hospitality';

export type UserRole = 'student' | 'mentor' | 'admin' | 'placement_cell';

export type SkillMasteryStatus =
  | 'mastered'
  | 'strong'
  | 'developing'
  | 'weak'
  | 'missing';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type MilestoneStage = 'learn' | 'practice' | 'build' | 'evaluate';

export type MilestoneStatus =
  | 'locked'
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'needs_improvement';

export interface UserAccount {
  id: string;
  profileId: string;
  name: string;
  email: string;
  password: string; // hashed or stored for demo verification
  role: UserRole;
  discipline: DisciplineType;
  stream?: string;
  studentId?: string; // university ID number
  avatarUrl?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'milestone' | 'assessment' | 'mentor' | 'curriculum' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  discipline: DisciplineType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  description: string;
  tags: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'interactive' | 'documentation' | 'article' | 'repo' | 'course';
  provider: string;
  url: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  whyRecommended?: string;
  embedType?: 'internal_reader' | 'sandbox' | 'external';
  approvalStatus?: 'approved' | 'pending_approval' | 'rejected';
  approvedByMentorName?: string;
  approvedAt?: string;
  aiRationale?: string;
}

export interface PracticeExercise {
  id: string;
  title: string;
  prompt: string;
  starterCode?: string;
  language?: string;
  expectedOutput?: string;
  hints: string[];
  solution?: string;
}

export interface ProjectPrompt {
  id: string;
  title: string;
  brief: string;
  deliverables: string[];
  evaluationCriteria: string[];
  industryContext: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  skillId: string;
  skillName: string;
  stage: MilestoneStage;
  description: string;
  estimatedHours: number;
  status: MilestoneStatus;
  order: number;
  resources: Resource[];
  practiceExercise?: PracticeExercise;
  projectPrompt?: ProjectPrompt;
  assessmentId?: string;
  isRemedial?: boolean;
  isFutureReady?: boolean;
  adaptationReason?: string;
  phase?: 'core_foundation' | 'placement_preparation' | 'portfolio_build' | 'future_ready';
  category?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillTopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  id: string;
  skillId: string;
  title: string;
  type: 'diagnostic' | 'topic' | 'readiness';
  discipline: DisciplineType;
  passingScore: number;
  questions: AssessmentQuestion[];
}

export interface CareerBenchmark {
  requiredSkills: {
    skillId: string;
    skillName: string;
    importance: 'mandatory' | 'recommended' | 'optional';
    targetProficiency: number;
  }[];
  prerequisiteCourses: string[];
  recommendedProjects: string[];
  emergingSkills: string[];
  readinessThreshold: number;
}

export interface CareerRole {
  id: string;
  title: string;
  responsibilities: string[];
  requiredSkillIds: string[];
  readinessCriteria: string;
  entrySalary: string;
}

export interface Career {
  id: string;
  title: string;
  discipline: DisciplineType;
  department?: string;
  roleCategory?: string;
  category: string;
  description: string;
  growthRate: string;
  medianSalary: string;
  scope: string;
  subCareers: string[];
  roles: CareerRole[];
  requiredSkillIds: string[];
  prerequisites: string[];
  relatedCareerIds: string[];
  benchmark: CareerBenchmark;
  iconName?: string;
  coreCourses?: string[];
  placementSkills?: string[];
  futureSkills?: string[];
  futureRelevance?: string;
  placementPreparation?: string;
  learningResources?: { title: string; url: string }[];
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  verified: boolean;
  link?: string;
}

export interface ReadinessScore {
  overallPercentage: number;
  technicalScore: number;
  projectScore: number;
  problemSolvingScore: number;
  softSkillScore: number;
  status: 'exploring' | 'starting' | 'building' | 'competent' | 'career_ready';
}

export interface StudentSkillRecord {
  skillId: string;
  skillName: string;
  level: number;
  verified: boolean;
  lastAssessedAt?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  discipline: DisciplineType;
  stream?: string;
  specialization?: string;
  degree: string;
  yearOfStudy: number;
  cgpa: number;
  targetCareerId: string;
  targetRoleId?: string;
  interests: string[];
  skills: StudentSkillRecord[];
  projects: StudentProject[];
  certifications: string[];
  assessmentScores: Record<string, number>;
  uncertaintyScore: number;
  readinessScore: ReadinessScore;
  learningPace: 'steady' | 'accelerated' | 'intensive';
  weeklyHoursCommitted: number;
  learningStyle?: 'hands_on' | 'visual' | 'reading' | 'interactive';
  targetTimeline?: 'immediate' | 'skill_building' | 'higher_studies';
  priorExperience?: string;
  completedMilestoneIds?: string[];
  completedResourceIds?: string[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  targetLevel: number;
  currentLevel: number;
  gapScore: number;
  status: SkillMasteryStatus;
  priority: PriorityLevel;
  prerequisiteFulfilled: boolean;
  rationale: string;
}

export interface NextBestAction {
  taskId: string;
  milestoneId?: string;
  title: string;
  targetSkill: string;
  estimatedMinutes: number;
  reason: string;
  actionType: 'assessment' | 'learn' | 'practice' | 'project' | 'revision';
  route: string;
}

export interface AdaptationContext {
  mode: 'fast_track' | 'remedial_support' | 'placement_calibrated' | 'future_ready';
  modeLabel: string;
  modeDescription: string;
  velocity: number;
  pace: string;
  totalMilestones: number;
  completedMilestones: number;
  remainingHours: number;
  projectedWeeks: number;
  remedialCount: number;
  fastTrackCount: number;
  futureReadyCount: number;
}

export interface CareerComparisonResult {
  sourceCareer: Career;
  targetCareer: Career;
  skillOverlapPercentage: number;
  transferableSkills: { skillId: string; skillName: string; proficiency: number }[];
  missingSkills: { skillId: string; skillName: string; targetLevel: number; priority: PriorityLevel }[];
  transitionDifficulty: 'low' | 'moderate' | 'high';
  estimatedMonths: number;
  suitabilityScore: number;
  preferabilityScore: number;
  pivotRoadmapSummary: { step: number; title: string; durationWeeks: number }[];
  rationale: string;
}

export interface MentorIntervention {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  targetCareer: string;
  reason: 'high_uncertainty' | 'persistent_gap' | 'assessment_failure' | 'inactivity';
  status: 'open' | 'addressed' | 'resolved';
  notes: string;
  createdAt: string;
  lastActionAt?: string;
}

export interface CurriculumGapInsight {
  id: string;
  discipline: DisciplineType;
  careerTitle: string;
  skillName: string;
  deficiencyPercentage: number;
  studentCount: number;
  suggestedIntervention: string;
  priority: 'high' | 'medium' | 'critical';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  contextSnapshot?: {
    careerTitle?: string;
    topGapSkill?: string;
    readiness?: number;
  };
}

// --- Real-Time Guidance & Doubt Clearance Models ---
export interface DoubtReply {
  id: string;
  doubtId: string;
  authorId: string;
  authorName: string;
  authorRole: 'mentor' | 'industrial_expert' | 'student' | 'placement_cell';
  authorTitle: string;
  authorOrg: string;
  content: string;
  codeSnippet?: string;
  verified: boolean;
  upvotes: number;
  createdAt: string;
}

export interface DoubtQuery {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  title: string;
  queryText: string;
  codeSnippet?: string;
  domain: string;
  category: 'technical' | 'career_guidance' | 'interview_prep' | 'academic_concept' | 'project_help';
  tags: string[];
  urgency: 'normal' | 'urgent';
  status: 'open' | 'answered' | 'resolved';
  createdAt: string;
  upvotes: number;
  replies: DoubtReply[];
}

// --- Live Placement Companies & Placement Cell Models ---
export interface PlacementCompanyDrive {
  id: string;
  companyName: string;
  logoUrl?: string;
  industry: string;
  roleTitle: string;
  ctcPackage: string;
  jobType: 'full_time' | 'internship_to_fte';
  workLocation: string;
  driveDate: string;
  applicationDeadline: string;
  status: 'active' | 'upcoming' | 'completed' | 'in_progress';
  eligibleDepartments: string[];
  minCgpa: number;
  minReadinessScore: number;
  requiredSkills: string[];
  selectionProcess: string[];
  description: string;
  hiringCount: number;
  registeredStudentIds: string[];
  shortlistedStudentIds: string[];
  placedStudentIds: string[];
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  studentId: string;
  studentName: string;
  department: string;
  cgpa: number;
  readinessPercentage: number;
  status: 'applied' | 'shortlisted' | 'assessment_cleared' | 'interview_scheduled' | 'offer_extended' | 'rejected';
  appliedAt: string;
  feedback?: string;
}

export interface PlacementAnalyticsSummary {
  totalDrives: number;
  activeDrives: number;
  totalEligibleStudents: number;
  totalApplications: number;
  totalOffersExtended: number;
  averageCtc: string;
  highestCtc: string;
  placementRatePercentage: number;
  departmentPlacementStats: {
    department: string;
    totalStudents: number;
    placedStudents: number;
    placementPercentage: number;
  }[];
}

// --- AI Course Material Suggestion & Mentor Approval Models ---
export interface CourseRecommendation {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department: string;
  targetCareer: string;
  skillGapName: string;
  courseTitle: string;
  provider: string;
  courseUrl: string;
  type: 'video' | 'interactive' | 'documentation' | 'article' | 'repo' | 'course';
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  aiRationale: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  mentorId?: string;
  mentorName?: string;
  mentorFeedback?: string;
  requestedAt: string;
  reviewedAt?: string;
}
