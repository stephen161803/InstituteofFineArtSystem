// Type definitions — mapped to FineArtsInstitute_Final DB schema

// =============================================
// ROLES & USERS
// =============================================

export type UserRole = 'admin' | 'manager' | 'staff' | 'student' | 'customer';

/** Maps to: Users JOIN Roles */
export interface User {
  id: number;
  username: string;
  passwordHash: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  roleId: number;
  role: UserRole;
  createdAt: string; // DATETIMEOFFSET → ISO string
  avatarUrl?: string;
}

/** Maps to: Students */
export interface Student {
  userId: number;
  admissionNumber: string;
  admissionDate?: string;
  dateOfBirth?: string;
  address?: string;
  // Joined from Users
  fullName: string;
  email?: string;
  phone?: string;
}

/** Maps to: Staffs */
export interface Staff {
  userId: number;
  dateJoined?: string;
  subjectHandled?: string;
  remarks?: string;
  // Joined from Users
  fullName: string;
  email?: string;
  phone?: string;
}

/** Maps to: Customers */
export interface Customer {
  id: number;
  userId: number;
  address?: string;
  notes?: string;
  createdAt: string;
  // Joined from Users
  fullName: string;
  email?: string;
  phone?: string;
}

// =============================================
// COMPETITIONS & CRITERIA
// =============================================

/** Maps to: Competitions */
export interface Competition {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy?: number; // Users.Id
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

/** Maps to: Criteria */
export interface Criteria {
  id: number;
  criteriaCode: string; // CREATIVITY, COMPLETION, SKILLS, COMPOSITION
  criteriaName: string;
  isActive: boolean;
}

/** Maps to: CompetitionCriteria */
export interface CompetitionCriteria {
  id: number;
  competitionId: number;
  criteriaId: number;
  weightPercent: number; // 0–100, sum per competition must = 100
  // Joined
  criteriaCode?: string;
  criteriaName?: string;
}

// =============================================
// SUBMISSIONS & REVIEWS
// =============================================

/** Maps to: Submissions */
export interface Submission {
  id: number;
  competitionId: number;
  studentId: number; // Users.Id
  title?: string;
  workUrl?: string;
  fileName?: string;      // original uploaded file name
  proposedPrice: number;
  description?: string;   // story / why created / why it should win
  quotation?: string;     // quotation related to the artwork
  poem?: string;          // poem or creative text
  submittedAt: string;
}

export type RatingLevel = 'Best' | 'Better' | 'Good' | 'Moderate' | 'Normal' | 'Disqualified';

/** Maps to: SubmissionReviews */
export interface SubmissionReview {
  id: number;
  submissionId: number;
  staffId: number; // Users.Id
  ratingLevel: RatingLevel;
  strengths?: string;
  weaknesses?: string;
  improvements?: string;
  reviewedAt: string;
}

/** Maps to: GradeDetails */
export interface GradeDetail {
  id: number;
  reviewId: number;
  criteriaId: number;
  rawScore: number; // 0–100
  // Joined
  criteriaCode?: string;
  criteriaName?: string;
  weightPercent?: number;
}

/** Maps to: vw_SubmissionTotalScore */
export interface SubmissionTotalScore {
  submissionId: number;
  totalScore: number; // 0–100 weighted
}

// =============================================
// AWARDS
// =============================================

/** Maps to: Awards */
export interface Award {
  id: number;
  awardName: string;
  description?: string;
}

/** Maps to: StudentAwards */
export interface StudentAward {
  id: number;
  submissionId: number;
  awardId: number;
  awardedBy: number; // Users.Id (Admin/Manager)
  awardedDate: string;
  // Joined
  awardName?: string;
  studentName?: string;
  competitionTitle?: string;
}

// =============================================
// EXHIBITIONS & SALES
// =============================================

/** Maps to: Exhibitions */
export interface Exhibition {
  id: number;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  status: 'Planned' | 'Ongoing' | 'Completed';
}

/** Maps to: ExhibitionSubmissions */
export interface ExhibitionSubmission {
  id: number;
  exhibitionId: number;
  submissionId: number;
  proposedPrice: number;
  status: 'Available' | 'Sold' | 'Returned';
  // Joined
  submissionTitle?: string;
  studentName?: string;
  workUrl?: string;
}

/** Maps to: Sales */
export interface Sale {
  id: number;
  exhibitionSubmissionId: number;
  customerId: number; // Customers.Id
  soldPrice: number;
  soldDate: string;
  // Joined
  customerName?: string;
  submissionTitle?: string;
  exhibitionTitle?: string;
}

// =============================================
// NOTIFICATIONS (frontend-only, no DB table)
// =============================================

export type NotificationType = 'award' | 'submission' | 'competition' | 'exhibition' | 'purchase' | 'announcement';

export interface Notification {
  id: string;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  metadata?: {
    competitionId?: number;
    submissionId?: number;
    awardId?: number;
    exhibitionId?: number;
  };
}
