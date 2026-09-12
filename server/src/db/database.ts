import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Career,
  Skill,
  Assessment,
  Resource,
  StudentProfile,
  MentorIntervention,
  CurriculumGapInsight,
  AIMessage,
  UserAccount,
  NotificationItem,
  DoubtQuery,
  DoubtReply,
  PlacementCompanyDrive,
  PlacementApplication,
  CourseRecommendation
} from '../types/shared.js';
import {
  SEED_CAREERS,
  SEED_SKILLS,
  SEED_ASSESSMENTS,
  SEED_RESOURCES,
  SEED_PROFILES,
  SEED_INTERVENTIONS,
  SEED_CURRICULUM_GAPS,
  SEED_USERS,
  SEED_NOTIFICATIONS,
  SEED_DOUBTS,
  SEED_PLACEMENT_DRIVES,
  SEED_PLACEMENT_APPLICATIONS,
  SEED_COURSE_RECOMMENDATIONS
} from './seedData.js';

interface DatabaseSchema {
  users: UserAccount[];
  careers: Career[];
  skills: Skill[];
  assessments: Assessment[];
  resources: Resource[];
  profiles: StudentProfile[];
  interventions: MentorIntervention[];
  curriculumGaps: CurriculumGapInsight[];
  notifications: NotificationItem[];
  doubts: DoubtQuery[];
  placementDrives: PlacementCompanyDrive[];
  placementApplications: PlacementApplication[];
  courseRecommendations: CourseRecommendation[];
  chatHistory: Record<string, AIMessage[]>; // studentId -> AIMessage[]
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.initialize();
  }

  private initialize(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.users.length > 0) {
          // Merge latest seed catalogs ensuring all new careers, skills, assessments are available
          parsed.careers = SEED_CAREERS;
          parsed.skills = SEED_SKILLS;
          parsed.assessments = SEED_ASSESSMENTS;
          parsed.resources = SEED_RESOURCES;
          parsed.curriculumGaps = SEED_CURRICULUM_GAPS;
          for (const su of SEED_USERS) {
            const idx = parsed.users.findIndex((u: any) => u.email === su.email || u.id === su.id);
            if (idx === -1) {
              parsed.users.push(su);
            } else {
              parsed.users[idx] = { ...su, ...parsed.users[idx] };
            }
          }
          if (!parsed.notifications || parsed.notifications.length === 0) {
            parsed.notifications = SEED_NOTIFICATIONS;
          }
          if (!parsed.doubts || parsed.doubts.length === 0) {
            parsed.doubts = SEED_DOUBTS;
          }
          if (!parsed.placementDrives || parsed.placementDrives.length === 0) {
            parsed.placementDrives = SEED_PLACEMENT_DRIVES;
          }
          if (!parsed.placementApplications || parsed.placementApplications.length === 0) {
            parsed.placementApplications = SEED_PLACEMENT_APPLICATIONS;
          }
          if (!parsed.courseRecommendations || parsed.courseRecommendations.length === 0) {
            parsed.courseRecommendations = SEED_COURSE_RECOMMENDATIONS;
          }
          this.saveData(parsed);
          return parsed;
        }
      } catch (err) {
        console.warn('Failed to parse existing db.json, re-initializing with seed data.', err);
      }
    }

    const initialData: DatabaseSchema = {
      users: SEED_USERS,
      careers: SEED_CAREERS,
      skills: SEED_SKILLS,
      assessments: SEED_ASSESSMENTS,
      resources: SEED_RESOURCES,
      profiles: SEED_PROFILES,
      interventions: SEED_INTERVENTIONS,
      curriculumGaps: SEED_CURRICULUM_GAPS,
      notifications: SEED_NOTIFICATIONS,
      doubts: SEED_DOUBTS,
      placementDrives: SEED_PLACEMENT_DRIVES,
      placementApplications: SEED_PLACEMENT_APPLICATIONS,
      courseRecommendations: SEED_COURSE_RECOMMENDATIONS,
      chatHistory: {}
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: DatabaseSchema = this.data): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data to db.json:', err);
    }
  }

  // --- Users ---
  public getUsers(): UserAccount[] {
    return this.data.users || [];
  }

  public getUserById(id: string): UserAccount | undefined {
    return (this.data.users || []).find(u => u.id === id);
  }

  public getUserByEmail(email: string): UserAccount | undefined {
    return (this.data.users || []).find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public saveUser(user: UserAccount): UserAccount {
    if (!this.data.users) this.data.users = [];
    const idx = this.data.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      this.data.users[idx] = user;
    } else {
      this.data.users.push(user);
    }
    this.saveData();
    return user;
  }

  // --- Careers ---
  public getCareers(discipline?: string): Career[] {
    if (discipline && discipline !== 'all') {
      return this.data.careers.filter(c => c.discipline === discipline);
    }
    return this.data.careers;
  }

  public getCareerById(id: string): Career | undefined {
    return this.data.careers.find(c => c.id === id);
  }

  public saveCareer(career: Career): Career {
    const idx = this.data.careers.findIndex(c => c.id === career.id);
    if (idx >= 0) {
      this.data.careers[idx] = career;
    } else {
      this.data.careers.push(career);
    }
    this.saveData();
    return career;
  }

  // --- Skills ---
  public getSkills(discipline?: string): Skill[] {
    if (discipline && discipline !== 'all') {
      return this.data.skills.filter(s => s.discipline === discipline);
    }
    return this.data.skills;
  }

  public getSkillById(id: string): Skill | undefined {
    return this.data.skills.find(s => s.id === id);
  }

  public saveSkill(skill: Skill): Skill {
    const idx = this.data.skills.findIndex(s => s.id === skill.id);
    if (idx >= 0) {
      this.data.skills[idx] = skill;
    } else {
      this.data.skills.push(skill);
    }
    this.saveData();
    return skill;
  }

  // --- Assessments ---
  public getAssessments(skillId?: string): Assessment[] {
    if (skillId) {
      return this.data.assessments.filter(a => a.skillId === skillId);
    }
    return this.data.assessments;
  }

  public getAssessmentById(id: string): Assessment | undefined {
    return this.data.assessments.find(a => a.id === id);
  }

  // --- Resources ---
  public getResources(): Resource[] {
    return this.data.resources;
  }

  public getResourceById(id: string): Resource | undefined {
    return this.data.resources.find(r => r.id === id);
  }

  public saveResource(resource: Resource): Resource {
    if (!this.data.resources) this.data.resources = [];
    const idx = this.data.resources.findIndex(r => r.id === resource.id);
    if (idx >= 0) {
      this.data.resources[idx] = resource;
    } else {
      this.data.resources.unshift(resource);
    }
    this.saveData();
    return resource;
  }

  // --- Profiles ---
  public getProfiles(): StudentProfile[] {
    return this.data.profiles;
  }

  public getProfileById(id: string): StudentProfile | undefined {
    return this.data.profiles.find(p => p.id === id || p.userId === id);
  }

  public saveProfile(profile: StudentProfile): StudentProfile {
    const idx = this.data.profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      this.data.profiles[idx] = profile;
    } else {
      this.data.profiles.push(profile);
    }
    this.saveData();
    return profile;
  }

  // --- Notifications ---
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return (this.data.notifications || []).filter(n => n.userId === userId);
    }
    return this.data.notifications || [];
  }

  public addNotification(item: NotificationItem): NotificationItem {
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.unshift(item);
    this.saveData();
    return item;
  }

  public markNotificationRead(id: string): void {
    if (!this.data.notifications) return;
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData();
    }
  }

  // --- Interventions ---
  public getInterventions(): MentorIntervention[] {
    return this.data.interventions;
  }

  public saveIntervention(intervention: MentorIntervention): MentorIntervention {
    const idx = this.data.interventions.findIndex(i => i.id === intervention.id);
    if (idx >= 0) {
      this.data.interventions[idx] = intervention;
    } else {
      this.data.interventions.push(intervention);
    }
    this.saveData();
    return intervention;
  }

  // --- Curriculum Gaps ---
  public getCurriculumGaps(): CurriculumGapInsight[] {
    return this.data.curriculumGaps;
  }

  public saveCurriculumGap(gap: CurriculumGapInsight): CurriculumGapInsight {
    const idx = this.data.curriculumGaps.findIndex(g => g.id === gap.id);
    if (idx >= 0) {
      this.data.curriculumGaps[idx] = gap;
    } else {
      this.data.curriculumGaps.push(gap);
    }
    this.saveData();
    return gap;
  }

  // --- Chat History ---
  public getChatHistory(studentId: string): AIMessage[] {
    return this.data.chatHistory[studentId] || [];
  }

  public addChatMessage(studentId: string, message: AIMessage): void {
    if (!this.data.chatHistory[studentId]) {
      this.data.chatHistory[studentId] = [];
    }
    this.data.chatHistory[studentId].push(message);
    this.saveData();
  }

  // --- Real-Time Guidance & Doubts ---
  public getDoubts(): DoubtQuery[] {
    return this.data.doubts || [];
  }

  public getDoubtById(id: string): DoubtQuery | undefined {
    return (this.data.doubts || []).find(d => d.id === id);
  }

  public saveDoubt(doubt: DoubtQuery): DoubtQuery {
    if (!this.data.doubts) this.data.doubts = [];
    const idx = this.data.doubts.findIndex(d => d.id === doubt.id);
    if (idx >= 0) {
      this.data.doubts[idx] = doubt;
    } else {
      this.data.doubts.unshift(doubt);
    }
    this.saveData();
    return doubt;
  }

  // --- Live Placement Drives ---
  public getPlacementDrives(): PlacementCompanyDrive[] {
    return this.data.placementDrives || [];
  }

  public getPlacementDriveById(id: string): PlacementCompanyDrive | undefined {
    return (this.data.placementDrives || []).find(d => d.id === id);
  }

  public savePlacementDrive(drive: PlacementCompanyDrive): PlacementCompanyDrive {
    if (!this.data.placementDrives) this.data.placementDrives = [];
    const idx = this.data.placementDrives.findIndex(d => d.id === drive.id);
    if (idx >= 0) {
      this.data.placementDrives[idx] = drive;
    } else {
      this.data.placementDrives.unshift(drive);
    }
    this.saveData();
    return drive;
  }

  // --- Student Placement Applications ---
  public getPlacementApplications(): PlacementApplication[] {
    return this.data.placementApplications || [];
  }

  public getPlacementApplicationsByStudent(studentId: string): PlacementApplication[] {
    return (this.data.placementApplications || []).filter(a => a.studentId === studentId);
  }

  public savePlacementApplication(app: PlacementApplication): PlacementApplication {
    if (!this.data.placementApplications) this.data.placementApplications = [];
    const idx = this.data.placementApplications.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      this.data.placementApplications[idx] = app;
    } else {
      this.data.placementApplications.unshift(app);
    }
    this.saveData();
    return app;
  }

  // --- Course Recommendations & Mentor Approval ---
  public getCourseRecommendations(filter?: { studentId?: string; status?: string }): CourseRecommendation[] {
    let recs = this.data.courseRecommendations || [];
    if (filter?.studentId) {
      recs = recs.filter(r => r.studentId === filter.studentId);
    }
    if (filter?.status) {
      recs = recs.filter(r => r.status === filter.status);
    }
    return recs;
  }

  public getCourseRecommendationById(id: string): CourseRecommendation | undefined {
    return (this.data.courseRecommendations || []).find(r => r.id === id);
  }

  public saveCourseRecommendation(rec: CourseRecommendation): CourseRecommendation {
    if (!this.data.courseRecommendations) this.data.courseRecommendations = [];
    const idx = this.data.courseRecommendations.findIndex(r => r.id === rec.id);
    if (idx >= 0) {
      this.data.courseRecommendations[idx] = rec;
    } else {
      this.data.courseRecommendations.unshift(rec);
    }
    this.saveData();
    return rec;
  }

  public resetToSeed(): void {
    this.data = {
      users: SEED_USERS,
      careers: SEED_CAREERS,
      skills: SEED_SKILLS,
      assessments: SEED_ASSESSMENTS,
      resources: SEED_RESOURCES,
      profiles: SEED_PROFILES,
      interventions: SEED_INTERVENTIONS,
      curriculumGaps: SEED_CURRICULUM_GAPS,
      notifications: SEED_NOTIFICATIONS,
      doubts: SEED_DOUBTS,
      placementDrives: SEED_PLACEMENT_DRIVES,
      placementApplications: SEED_PLACEMENT_APPLICATIONS,
      courseRecommendations: SEED_COURSE_RECOMMENDATIONS,
      chatHistory: {}
    };
    this.saveData();
  }
}

export const db = new DatabaseService();
