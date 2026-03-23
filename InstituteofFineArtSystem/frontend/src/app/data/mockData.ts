import {
  User,
  Staff,
  Student,
  Customer,
  Competition,
  Criteria,
  CompetitionCriteria,
  Submission,
  SubmissionReview,
  GradeDetail,
  Award,
  StudentAward,
  Exhibition,
  ExhibitionSubmission,
  Sale,
  Notification,
} from '../types';

// =============================================
// USERS
// =============================================
export const mockUsers: User[] = [
  { id: 1, username: 'manager', passwordHash: 'manager123', fullName: 'John Manager', email: 'manager@artschool.com', phone: '+1-555-0001', isActive: true, roleId: 2, role: 'manager', createdAt: '2024-01-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager' },
  { id: 2, username: 'admin', passwordHash: 'admin123', fullName: 'Sarah Admin', email: 'admin@artschool.com', phone: '+1-555-0002', isActive: true, roleId: 1, role: 'admin', createdAt: '2024-01-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
  { id: 3, username: 'staff1', passwordHash: 'staff123', fullName: 'Emily Teacher', email: 'teacher1@artschool.com', phone: '+1-555-0101', isActive: true, roleId: 3, role: 'staff', createdAt: '2024-01-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
  { id: 4, username: 'staff2', passwordHash: 'staff123', fullName: 'Robert Brown', email: 'teacher2@artschool.com', phone: '+1-555-0102', isActive: true, roleId: 3, role: 'staff', createdAt: '2024-01-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert' },
  { id: 5, username: 'staff3', passwordHash: 'staff123', fullName: 'Lisa Anderson', email: 'teacher3@artschool.com', phone: '+1-555-0103', isActive: true, roleId: 3, role: 'staff', createdAt: '2024-01-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
  { id: 6, username: 'student1', passwordHash: 'student123', fullName: 'Alice Johnson', email: 'alice@student.com', phone: '+1-555-0201', isActive: true, roleId: 4, role: 'student', createdAt: '2023-09-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
  { id: 7, username: 'student2', passwordHash: 'student123', fullName: 'Bob Smith', email: 'bob@student.com', phone: '+1-555-0202', isActive: true, roleId: 4, role: 'student', createdAt: '2023-09-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
  { id: 8, username: 'student3', passwordHash: 'student123', fullName: 'Charlie Chen', email: 'charlie@student.com', phone: '+1-555-0203', isActive: true, roleId: 4, role: 'student', createdAt: '2023-09-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie' },
  { id: 9, username: 'student4', passwordHash: 'student123', fullName: 'Diana Martinez', email: 'diana@student.com', phone: '+1-555-0204', isActive: true, roleId: 4, role: 'student', createdAt: '2023-09-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana' },
  { id: 10, username: 'student5', passwordHash: 'student123', fullName: 'Emma Wilson', email: 'emma@student.com', phone: '+1-555-0205', isActive: true, roleId: 4, role: 'student', createdAt: '2023-09-01T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
  { id: 11, username: 'customer1', passwordHash: 'customer123', fullName: 'Michael Brown', email: 'customer1@gmail.com', phone: '+1-555-0301', isActive: true, roleId: 5, role: 'customer', createdAt: '2026-01-15T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael' },
  { id: 12, username: 'customer2', passwordHash: 'customer123', fullName: 'Jessica Taylor', email: 'customer2@gmail.com', phone: '+1-555-0302', isActive: true, roleId: 5, role: 'customer', createdAt: '2026-02-20T00:00:00Z', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica' },
];

// =============================================
// STAFFS
// =============================================
export let mockStaffs: Staff[] = [
  { userId: 3, dateJoined: '2020-08-15', subjectHandled: 'Art & Design', remarks: 'Excellent track record in student mentorship', fullName: 'Emily Teacher', email: 'teacher1@artschool.com', phone: '+1-555-0101' },
  { userId: 4, dateJoined: '2021-09-20', subjectHandled: 'Art & Design', remarks: 'Innovative teaching methods', fullName: 'Robert Brown', email: 'teacher2@artschool.com', phone: '+1-555-0102' },
  { userId: 5, dateJoined: '2022-10-25', subjectHandled: 'Art & Design', remarks: 'Passionate about art education', fullName: 'Lisa Anderson', email: 'teacher3@artschool.com', phone: '+1-555-0103' },
];

// =============================================
// STUDENTS
// =============================================
export let mockStudents: Student[] = [
  { userId: 6, admissionNumber: 'A001', admissionDate: '2023-09-01', dateOfBirth: '2007-03-15', address: '123 Main St', fullName: 'Alice Johnson', email: 'alice@student.com', phone: '+1-555-0201' },
  { userId: 7, admissionNumber: 'A002', admissionDate: '2023-09-01', dateOfBirth: '2006-07-22', address: '456 Oak Ave', fullName: 'Bob Smith', email: 'bob@student.com', phone: '+1-555-0202' },
  { userId: 8, admissionNumber: 'A003', admissionDate: '2023-09-01', dateOfBirth: '2007-11-08', address: '789 Pine Rd', fullName: 'Charlie Chen', email: 'charlie@student.com', phone: '+1-555-0203' },
  { userId: 9, admissionNumber: 'A004', admissionDate: '2023-09-01', dateOfBirth: '2006-05-30', address: '321 Elm St', fullName: 'Diana Martinez', email: 'diana@student.com', phone: '+1-555-0204' },
  { userId: 10, admissionNumber: 'A005', admissionDate: '2023-09-01', dateOfBirth: '2007-09-12', address: '654 Maple Dr', fullName: 'Emma Wilson', email: 'emma@student.com', phone: '+1-555-0205' },
];

// =============================================
// CUSTOMERS
// =============================================
export let mockCustomers: Customer[] = [
  { id: 1, userId: 11, address: '100 Buyer Lane, New York', notes: 'Prefers modern art', createdAt: '2026-01-15T00:00:00Z', fullName: 'Michael Brown', email: 'customer1@gmail.com', phone: '+1-555-0301' },
  { id: 2, userId: 12, address: '200 Collector Ave, LA', notes: 'Interested in watercolor', createdAt: '2026-02-20T00:00:00Z', fullName: 'Jessica Taylor', email: 'customer2@gmail.com', phone: '+1-555-0302' },
];

// =============================================
// CRITERIA
// =============================================
export const mockCriteria: Criteria[] = [
  { id: 1, criteriaCode: 'CREATIVITY', criteriaName: 'Creativity', isActive: true },
  { id: 2, criteriaCode: 'COMPLETION', criteriaName: 'Completion', isActive: true },
  { id: 3, criteriaCode: 'SKILLS', criteriaName: 'Skills', isActive: true },
  { id: 4, criteriaCode: 'COMPOSITION', criteriaName: 'Composition', isActive: true },
];

// =============================================
// COMPETITIONS
// =============================================
export let mockCompetitions: Competition[] = [
  { id: 1, title: 'Spring Art Festival 2026', description: 'Celebrate spring with vibrant paintings', startDate: '2026-03-01', endDate: '2026-03-31', createdBy: 3, status: 'Ongoing' },
  { id: 2, title: 'Abstract Expression Contest', description: 'Explore abstract art techniques', startDate: '2026-04-01', endDate: '2026-04-30', createdBy: 4, status: 'Upcoming' },
  { id: 3, title: 'Winter Wonderland 2025', description: 'Winter themed artwork competition', startDate: '2025-12-01', endDate: '2026-01-15', createdBy: 3, status: 'Completed' },
  { id: 4, title: 'Summer Creativity Challenge 2025', description: 'Showcase your creativity with summer-inspired artwork', startDate: '2025-06-01', endDate: '2025-08-31', createdBy: 5, status: 'Completed' },
];

// =============================================
// COMPETITION CRITERIA (weights sum = 100 per competition)
// =============================================
export let mockCompetitionCriteria: CompetitionCriteria[] = [
  // Competition 1
  { id: 1, competitionId: 1, criteriaId: 1, weightPercent: 30, criteriaCode: 'CREATIVITY', criteriaName: 'Creativity' },
  { id: 2, competitionId: 1, criteriaId: 2, weightPercent: 25, criteriaCode: 'COMPLETION', criteriaName: 'Completion' },
  { id: 3, competitionId: 1, criteriaId: 3, weightPercent: 25, criteriaCode: 'SKILLS', criteriaName: 'Skills' },
  { id: 4, competitionId: 1, criteriaId: 4, weightPercent: 20, criteriaCode: 'COMPOSITION', criteriaName: 'Composition' },
  // Competition 2
  { id: 5, competitionId: 2, criteriaId: 1, weightPercent: 40, criteriaCode: 'CREATIVITY', criteriaName: 'Creativity' },
  { id: 6, competitionId: 2, criteriaId: 2, weightPercent: 20, criteriaCode: 'COMPLETION', criteriaName: 'Completion' },
  { id: 7, competitionId: 2, criteriaId: 3, weightPercent: 20, criteriaCode: 'SKILLS', criteriaName: 'Skills' },
  { id: 8, competitionId: 2, criteriaId: 4, weightPercent: 20, criteriaCode: 'COMPOSITION', criteriaName: 'Composition' },
  // Competition 3
  { id: 9,  competitionId: 3, criteriaId: 1, weightPercent: 25, criteriaCode: 'CREATIVITY', criteriaName: 'Creativity' },
  { id: 10, competitionId: 3, criteriaId: 2, weightPercent: 25, criteriaCode: 'COMPLETION', criteriaName: 'Completion' },
  { id: 11, competitionId: 3, criteriaId: 3, weightPercent: 25, criteriaCode: 'SKILLS', criteriaName: 'Skills' },
  { id: 12, competitionId: 3, criteriaId: 4, weightPercent: 25, criteriaCode: 'COMPOSITION', criteriaName: 'Composition' },
  // Competition 4
  { id: 13, competitionId: 4, criteriaId: 1, weightPercent: 30, criteriaCode: 'CREATIVITY', criteriaName: 'Creativity' },
  { id: 14, competitionId: 4, criteriaId: 2, weightPercent: 25, criteriaCode: 'COMPLETION', criteriaName: 'Completion' },
  { id: 15, competitionId: 4, criteriaId: 3, weightPercent: 25, criteriaCode: 'SKILLS', criteriaName: 'Skills' },
  { id: 16, competitionId: 4, criteriaId: 4, weightPercent: 20, criteriaCode: 'COMPOSITION', criteriaName: 'Composition' },
];

// =============================================
// SUBMISSIONS
// =============================================
export let mockSubmissions: Submission[] = [
  // Spring Art Festival 2026 (Ongoing) - competitionId: 1
  { id: 1,  competitionId: 1, studentId: 6,  title: 'Blooming Dreams',      workUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', proposedPrice: 2500000, submittedAt: '2026-03-05T09:00:00Z' },
  { id: 2,  competitionId: 1, studentId: 7,  title: 'Spring Meadow',         workUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3b4ae5f1?w=800', proposedPrice: 1800000, submittedAt: '2026-03-08T10:00:00Z' },
  { id: 3,  competitionId: 1, studentId: 8,  title: 'Cherry Blossom Dance',  workUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', proposedPrice: 2100000, submittedAt: '2026-03-10T11:00:00Z' },
  { id: 4,  competitionId: 1, studentId: 9,  title: 'Butterfly Garden',      workUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800', proposedPrice: 1900000, submittedAt: '2026-03-12T09:30:00Z' },
  { id: 5,  competitionId: 1, studentId: 10, title: 'Rain and Renewal',      workUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', proposedPrice: 1600000, submittedAt: '2026-03-15T14:00:00Z' },
  // Winter Wonderland 2025 (Completed) - competitionId: 3
  { id: 6,  competitionId: 3, studentId: 6,  title: 'Frozen Serenity',       workUrl: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=800', proposedPrice: 3000000, submittedAt: '2025-12-15T09:00:00Z' },
  { id: 7,  competitionId: 3, studentId: 7,  title: 'Silent Snowfall',       workUrl: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800', proposedPrice: 2200000, submittedAt: '2025-12-18T10:00:00Z' },
  { id: 8,  competitionId: 3, studentId: 8,  title: 'Winter Forest',         workUrl: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?w=800', proposedPrice: 2800000, submittedAt: '2025-12-20T11:00:00Z' },
  { id: 9,  competitionId: 3, studentId: 9,  title: 'Ice Crystal Magic',     workUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800', proposedPrice: 1700000, submittedAt: '2025-12-22T09:00:00Z' },
  { id: 10, competitionId: 3, studentId: 10, title: 'Aurora Dreams',         workUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', proposedPrice: 2400000, submittedAt: '2025-12-25T10:00:00Z' },
  // Summer Creativity Challenge 2025 (Completed) - competitionId: 4
  { id: 11, competitionId: 4, studentId: 6,  title: 'Beach Paradise',        workUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', proposedPrice: 3500000, submittedAt: '2025-07-10T09:00:00Z' },
  { id: 12, competitionId: 4, studentId: 7,  title: 'Sunset Sailing',        workUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800', proposedPrice: 2600000, submittedAt: '2025-07-15T10:00:00Z' },
  { id: 13, competitionId: 4, studentId: 8,  title: 'Summer Rain',           workUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', proposedPrice: 2000000, submittedAt: '2025-07-20T11:00:00Z' },
  { id: 14, competitionId: 4, studentId: 9,  title: 'Mountain Adventure',    workUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', proposedPrice: 3200000, submittedAt: '2025-08-01T09:00:00Z' },
  { id: 15, competitionId: 4, studentId: 10, title: 'Sunflower Fields',      workUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800', proposedPrice: 2800000, submittedAt: '2025-08-10T10:00:00Z' },
];

// =============================================
// SUBMISSION REVIEWS
// =============================================
export let mockSubmissionReviews: SubmissionReview[] = [
  { id: 1,  submissionId: 1,  staffId: 3, ratingLevel: 'Best',     strengths: 'Excellent color palette, strong composition', weaknesses: 'Minor perspective issue in background', improvements: 'Work on depth perception',          reviewedAt: '2026-03-14T15:30:00Z' },
  { id: 2,  submissionId: 2,  staffId: 3, ratingLevel: 'Better',   strengths: 'Nice composition and color harmony',           weaknesses: 'Could use more detail in foreground',      improvements: 'Focus on texture and detail work',    reviewedAt: '2026-03-14T16:00:00Z' },
  { id: 3,  submissionId: 3,  staffId: 3, ratingLevel: 'Good',     strengths: 'Beautiful color work, delicate brushstrokes',  weaknesses: 'Composition could be stronger',            improvements: 'Study composition techniques',         reviewedAt: '2026-03-14T16:30:00Z' },
  { id: 4,  submissionId: 4,  staffId: 3, ratingLevel: 'Better',   strengths: 'Great use of color, imaginative concept',      weaknesses: 'Some anatomical inaccuracies',             improvements: 'Study butterfly anatomy',              reviewedAt: '2026-03-14T17:00:00Z' },
  { id: 5,  submissionId: 5,  staffId: 3, ratingLevel: 'Good',     strengths: 'Good mood and atmosphere',                    weaknesses: 'Technical execution needs refinement',     improvements: 'Practice wet-on-wet techniques',       reviewedAt: '2026-03-14T17:30:00Z' },
  { id: 6,  submissionId: 6,  staffId: 3, ratingLevel: 'Best',     strengths: 'Perfect winter atmosphere, masterful technique', weaknesses: 'None significant',                       improvements: 'Continue developing personal style',   reviewedAt: '2026-01-10T10:00:00Z' },
  { id: 7,  submissionId: 7,  staffId: 3, ratingLevel: 'Better',   strengths: 'Excellent mood, good technique',              weaknesses: 'Could use more contrast',                  improvements: 'Experiment with value contrast',       reviewedAt: '2026-01-10T10:30:00Z' },
  { id: 8,  submissionId: 8,  staffId: 3, ratingLevel: 'Best',     strengths: 'Masterful composition, beautiful light',      weaknesses: 'Minor issues with perspective',            improvements: 'Continue studying perspective',        reviewedAt: '2026-01-10T11:00:00Z' },
  { id: 9,  submissionId: 9,  staffId: 3, ratingLevel: 'Good',     strengths: 'Creative concept, good detail work',          weaknesses: 'Needs more depth',                         improvements: 'Work on creating depth',               reviewedAt: '2026-01-10T11:30:00Z' },
  { id: 10, submissionId: 10, staffId: 3, ratingLevel: 'Better',   strengths: 'Bold color choices, imaginative',             weaknesses: 'Execution needs refinement',               improvements: 'Practice blending techniques',         reviewedAt: '2026-01-10T12:00:00Z' },
  { id: 11, submissionId: 11, staffId: 3, ratingLevel: 'Best',     strengths: 'Perfect color palette, great atmosphere',     weaknesses: 'None significant',                         improvements: 'Continue exploring marine themes',     reviewedAt: '2025-09-01T10:00:00Z' },
  { id: 12, submissionId: 12, staffId: 3, ratingLevel: 'Better',   strengths: 'Excellent use of warm colors',                weaknesses: 'Boat proportions slightly off',            improvements: 'Study nautical subjects',              reviewedAt: '2025-09-01T10:30:00Z' },
  { id: 13, submissionId: 13, staffId: 3, ratingLevel: 'Good',     strengths: 'Good atmospheric effects',                   weaknesses: 'Could be more dynamic',                    improvements: 'Work on movement and energy',          reviewedAt: '2025-09-01T11:00:00Z' },
  { id: 14, submissionId: 14, staffId: 3, ratingLevel: 'Best',     strengths: 'Great composition, strong sense of place',   weaknesses: 'Some color harmony issues',                improvements: 'Study color theory',                   reviewedAt: '2025-09-01T11:30:00Z' },
  { id: 15, submissionId: 15, staffId: 3, ratingLevel: 'Better',   strengths: 'Happy mood, good use of yellows',            weaknesses: 'Repetitive elements need variation',       improvements: 'Add more variety in composition',      reviewedAt: '2025-09-01T12:00:00Z' },
];

// =============================================
// GRADE DETAILS (rawScore 0-100 per criteria)
// =============================================
export let mockGradeDetails: GradeDetail[] = [
  // Review 1 (submissionId: 1, Best) — comp 1 weights: 30/25/25/20
  { id: 1,  reviewId: 1, criteriaId: 1, rawScore: 95, criteriaCode: 'CREATIVITY',  criteriaName: 'Creativity',   weightPercent: 30 },
  { id: 2,  reviewId: 1, criteriaId: 2, rawScore: 90, criteriaCode: 'COMPLETION',  criteriaName: 'Completion', weightPercent: 25 },
  { id: 3,  reviewId: 1, criteriaId: 3, rawScore: 88, criteriaCode: 'SKILLS',      criteriaName: 'Skills',    weightPercent: 25 },
  { id: 4,  reviewId: 1, criteriaId: 4, rawScore: 92, criteriaCode: 'COMPOSITION', criteriaName: 'Composition',     weightPercent: 20 },
  // Review 2 (submissionId: 2, Better)
  { id: 5,  reviewId: 2, criteriaId: 1, rawScore: 80, criteriaCode: 'CREATIVITY',  criteriaName: 'Creativity',   weightPercent: 30 },
  { id: 6,  reviewId: 2, criteriaId: 2, rawScore: 78, criteriaCode: 'COMPLETION',  criteriaName: 'Completion', weightPercent: 25 },
  { id: 7,  reviewId: 2, criteriaId: 3, rawScore: 75, criteriaCode: 'SKILLS',      criteriaName: 'Skills',    weightPercent: 25 },
  { id: 8,  reviewId: 2, criteriaId: 4, rawScore: 82, criteriaCode: 'COMPOSITION', criteriaName: 'Composition',     weightPercent: 20 },
  // Review 6 (submissionId: 6, Best — Winter)
  { id: 9,  reviewId: 6, criteriaId: 1, rawScore: 96, criteriaCode: 'CREATIVITY',  criteriaName: 'Creativity',   weightPercent: 25 },
  { id: 10, reviewId: 6, criteriaId: 2, rawScore: 94, criteriaCode: 'COMPLETION',  criteriaName: 'Completion', weightPercent: 25 },
  { id: 11, reviewId: 6, criteriaId: 3, rawScore: 95, criteriaCode: 'SKILLS',      criteriaName: 'Skills',    weightPercent: 25 },
  { id: 12, reviewId: 6, criteriaId: 4, rawScore: 93, criteriaCode: 'COMPOSITION', criteriaName: 'Composition',     weightPercent: 25 },
  // Review 11 (submissionId: 11, Best — Summer)
  { id: 13, reviewId: 11, criteriaId: 1, rawScore: 97, criteriaCode: 'CREATIVITY',  criteriaName: 'Creativity',   weightPercent: 30 },
  { id: 14, reviewId: 11, criteriaId: 2, rawScore: 93, criteriaCode: 'COMPLETION',  criteriaName: 'Completion', weightPercent: 25 },
  { id: 15, reviewId: 11, criteriaId: 3, rawScore: 91, criteriaCode: 'SKILLS',      criteriaName: 'Skills',    weightPercent: 25 },
  { id: 16, reviewId: 11, criteriaId: 4, rawScore: 95, criteriaCode: 'COMPOSITION', criteriaName: 'Composition',     weightPercent: 20 },
];

// =============================================
// AWARDS
// =============================================
export const mockAwards: Award[] = [
  { id: 1, awardName: 'First Prize',       description: 'Best artwork in the competition' },
  { id: 2, awardName: 'Second Prize',      description: 'Runner-up artwork' },
  { id: 3, awardName: 'Third Prize',       description: 'Third place artwork' },
  { id: 4, awardName: 'Honorable Mention', description: 'Notable artwork deserving recognition' },
  { id: 5, awardName: 'Best Use of Color', description: 'Outstanding use of color in artwork' },
];

export let mockStudentAwards: StudentAward[] = [
  // Winter Wonderland 2025
  { id: 1, submissionId: 6,  awardId: 1, awardedBy: 1, awardedDate: '2026-01-20', awardName: 'First Prize',       studentName: 'Alice Johnson',   competitionTitle: 'Winter Wonderland 2025' },
  { id: 2, submissionId: 8,  awardId: 2, awardedBy: 1, awardedDate: '2026-01-20', awardName: 'Second Prize',      studentName: 'Charlie Chen',    competitionTitle: 'Winter Wonderland 2025' },
  { id: 3, submissionId: 7,  awardId: 3, awardedBy: 1, awardedDate: '2026-01-20', awardName: 'Third Prize',       studentName: 'Bob Smith',       competitionTitle: 'Winter Wonderland 2025' },
  // Summer Creativity Challenge 2025
  { id: 4, submissionId: 11, awardId: 1, awardedBy: 1, awardedDate: '2025-09-05', awardName: 'First Prize',       studentName: 'Alice Johnson',   competitionTitle: 'Summer Creativity Challenge 2025' },
  { id: 5, submissionId: 14, awardId: 2, awardedBy: 1, awardedDate: '2025-09-05', awardName: 'Second Prize',      studentName: 'Diana Martinez',  competitionTitle: 'Summer Creativity Challenge 2025' },
  { id: 6, submissionId: 15, awardId: 3, awardedBy: 1, awardedDate: '2025-09-05', awardName: 'Third Prize',       studentName: 'Emma Wilson',     competitionTitle: 'Summer Creativity Challenge 2025' },
  { id: 7, submissionId: 12, awardId: 5, awardedBy: 1, awardedDate: '2025-09-05', awardName: 'Best Use of Color', studentName: 'Bob Smith',       competitionTitle: 'Summer Creativity Challenge 2025' },
];

// =============================================
// EXHIBITIONS
// =============================================
export let mockExhibitions: Exhibition[] = [
  { id: 1, title: 'Contemporary Digital Art 2026',  location: 'Museum of Modern Art, New York',          startDate: '2026-03-01', endDate: '2026-03-31', status: 'Ongoing' },
  { id: 2, title: 'Spring Watercolor Festival',     location: 'Art Gallery Downtown, Los Angeles',       startDate: '2026-02-15', endDate: '2026-04-15', status: 'Ongoing' },
  { id: 3, title: 'Abstract Expressions',           location: 'Chicago Contemporary Center',             startDate: '2026-01-10', endDate: '2026-02-28', status: 'Completed' },
  { id: 4, title: 'Youth Portrait Excellence',      location: 'National Portrait Gallery, Washington DC', startDate: '2025-12-01', endDate: '2026-01-15', status: 'Completed' },
  { id: 5, title: 'Summer Landscape Collection',    location: 'Seattle Art Museum, Washington',          startDate: '2026-06-01', endDate: '2026-07-31', status: 'Planned' },
];

// =============================================
// EXHIBITION SUBMISSIONS
// =============================================
export let mockExhibitionSubmissions: ExhibitionSubmission[] = [
  { id: 1,  exhibitionId: 1, submissionId: 1,  proposedPrice: 2500000, status: 'Available', submissionTitle: 'Blooming Dreams',     studentName: 'Alice Johnson',  workUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800' },
  { id: 2,  exhibitionId: 1, submissionId: 2,  proposedPrice: 1800000, status: 'Sold',      submissionTitle: 'Spring Meadow',       studentName: 'Bob Smith',      workUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3b4ae5f1?w=800' },
  { id: 3,  exhibitionId: 1, submissionId: 5,  proposedPrice: 3200000, status: 'Available', submissionTitle: 'Rain and Renewal',    studentName: 'Emma Wilson',    workUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800' },
  { id: 4,  exhibitionId: 2, submissionId: 6,  proposedPrice: 1500000, status: 'Available', submissionTitle: 'Frozen Serenity',     studentName: 'Alice Johnson',  workUrl: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=800' },
  { id: 5,  exhibitionId: 2, submissionId: 3,  proposedPrice: 2100000, status: 'Sold',      submissionTitle: 'Cherry Blossom Dance', studentName: 'Charlie Chen',  workUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800' },
  { id: 6,  exhibitionId: 3, submissionId: 7,  proposedPrice: 2800000, status: 'Returned',  submissionTitle: 'Silent Snowfall',     studentName: 'Bob Smith',      workUrl: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800' },
  { id: 7,  exhibitionId: 4, submissionId: 8,  proposedPrice: 2200000, status: 'Sold',      submissionTitle: 'Winter Forest',       studentName: 'Charlie Chen',   workUrl: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?w=800' },
  { id: 8,  exhibitionId: 4, submissionId: 9,  proposedPrice: 1600000, status: 'Returned',  submissionTitle: 'Ice Crystal Magic',   studentName: 'Diana Martinez', workUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800' },
  { id: 9,  exhibitionId: 5, submissionId: 11, proposedPrice: 3500000, status: 'Available', submissionTitle: 'Beach Paradise',      studentName: 'Alice Johnson',  workUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { id: 10, exhibitionId: 5, submissionId: 14, proposedPrice: 4200000, status: 'Available', submissionTitle: 'Mountain Adventure',  studentName: 'Diana Martinez', workUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800' },
];

// =============================================
// SALES
// =============================================
export let mockSales: Sale[] = [
  { id: 1, exhibitionSubmissionId: 2, customerId: 1, soldPrice: 2200000, soldDate: '2026-03-10T14:00:00Z', customerName: 'Michael Brown',  submissionTitle: 'Spring Meadow',       exhibitionTitle: 'Contemporary Digital Art 2026' },
  { id: 2, exhibitionSubmissionId: 5, customerId: 2, soldPrice: 2400000, soldDate: '2026-03-05T11:00:00Z', customerName: 'Jessica Taylor', submissionTitle: 'Cherry Blossom Dance', exhibitionTitle: 'Spring Watercolor Festival' },
  { id: 3, exhibitionSubmissionId: 7, customerId: 1, soldPrice: 2700000, soldDate: '2026-01-14T15:00:00Z', customerName: 'Michael Brown',  submissionTitle: 'Winter Forest',        exhibitionTitle: 'Youth Portrait Excellence' },
];

// =============================================
// NOTIFICATIONS (frontend-only)
// =============================================
export let mockNotifications: Notification[] = [
  { id: '1', userId: 2, type: 'submission',  title: 'New Submission Received',     message: 'Alice Johnson submitted "Blooming Dreams" for Spring Art Festival 2026',          timestamp: '2026-03-15T09:30:00Z', isRead: false, link: '/dashboard/submissions',  metadata: { competitionId: 1, submissionId: 1 } },
  { id: '2', userId: 2, type: 'purchase',    title: 'Artwork Sold',                message: 'Spring Meadow was sold for 2,200,000 VND at Contemporary Digital Art exhibition', timestamp: '2026-03-14T14:20:00Z', isRead: false, link: '/dashboard/exhibitions',  metadata: { exhibitionId: 1, submissionId: 2 } },
  { id: '3', userId: 2, type: 'competition', title: 'Competition Ending Soon',     message: 'Spring Art Festival 2026 will end in 16 days',                                    timestamp: '2026-03-15T08:00:00Z', isRead: true,  link: '/dashboard/competitions', metadata: { competitionId: 1 } },
  { id: '4', userId: 3, type: 'submission',  title: 'New Submission to Review',    message: 'Charlie Chen submitted "Cherry Blossom Dance" awaiting your evaluation',          timestamp: '2026-03-15T10:15:00Z', isRead: false, link: '/dashboard/submissions',  metadata: { competitionId: 1, submissionId: 3 } },
  { id: '5', userId: 3, type: 'submission',  title: 'Pending Evaluations',         message: 'You have 3 submissions pending evaluation for Spring Art Festival',               timestamp: '2026-03-14T16:00:00Z', isRead: false, link: '/dashboard/submissions' },
  { id: '6', userId: 3, type: 'competition', title: 'Competition Deadline',        message: 'Spring Art Festival 2026 submissions close in 16 days',                           timestamp: '2026-03-15T08:00:00Z', isRead: true,  link: '/dashboard/competitions', metadata: { competitionId: 1 } },
  { id: '7', userId: 6, type: 'award',       title: 'Congratulations! Award Won',  message: 'You won First Prize in Winter Wonderland 2025 for "Frozen Serenity"',             timestamp: '2026-01-20T11:00:00Z', isRead: false, link: '/dashboard/my-awards',    metadata: { competitionId: 3, awardId: 1, submissionId: 6 } },
  { id: '8', userId: 6, type: 'submission',  title: 'Submission Evaluated',        message: 'Your submission "Blooming Dreams" has been rated as "Best"',                      timestamp: '2026-03-14T15:30:00Z', isRead: false, link: '/dashboard/my-submissions', metadata: { competitionId: 1, submissionId: 1 } },
  { id: '9', userId: 6, type: 'purchase',    title: 'Your Artwork Was Sold',       message: '"Spring Meadow" was sold for 2,200,000 VND',                                      timestamp: '2026-03-10T14:00:00Z', isRead: true,  link: '/dashboard/my-submissions', metadata: { submissionId: 2 } },
];

// =============================================
// HELPER FUNCTIONS
// =============================================

export function markNotificationAsRead(id: string) {
  const n = mockNotifications.find(n => n.id === id);
  if (n) n.isRead = true;
}

export function markAllNotificationsAsRead(userId: number) {
  mockNotifications.filter(n => n.userId === userId).forEach(n => { n.isRead = true; });
}

/** Tính tổng điểm theo trọng số — mirror vw_SubmissionTotalScore */
export function calcTotalScore(reviewId: number): number {
  const details = mockGradeDetails.filter(g => g.reviewId === reviewId);
  return details.reduce((sum, g) => sum + (g.rawScore * (g.weightPercent ?? 0) / 100), 0);
}
