-- ============================================================
-- IoFA Seed Data
-- Run AFTER IoFA1.sql (schema + default Roles/Criteria already inserted)
-- Database: FineArtsInstitute_Final
-- Plain-text password for all accounts: password123
-- ============================================================

USE FineArtsInstitute_Final;
GO

-- ============================================================
-- 1. USERS
--    RoleId: 1=Admin, 2=Manager, 3=Staff, 4=Student, 5=Customer
-- ============================================================

SET IDENTITY_INSERT Users ON;

INSERT INTO Users (Id, Username, PasswordHash, FullName, Email, Phone, IsActive, RoleId, AvatarUrl)
VALUES
  (1, 'admin',     'password123', 'Admin User',    'admin@ifa.edu',          NULL, 1, 1, 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
  (2, 'manager',   'password123', 'Manager User',  'manager@ifa.edu',         NULL, 1, 2, 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager'),
  (3, 'staff',     'password123', 'Staff Member',  'staff@ifa.edu',           '555-0103', 1, 3, 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff'),
  (4, 'alice',     'password123', 'Alice Johnson', 'alice@student.ifa.edu',   '555-0104', 1, 4, 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'),
  (5, 'bob',       'password123', 'Bob Smith',     'bob@student.ifa.edu',     '555-0105', 1, 4, 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'),
  (6, 'carol',     'password123', 'Carol White',   'carol@student.ifa.edu',   '555-0106', 1, 4, 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol'),
  (7, 'customer1', 'password123', 'Customer One',  'customer1@example.com',   NULL, 1, 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer1'),
  (8, 'customer2', 'password123', 'Customer Two',  'customer2@example.com',   NULL, 1, 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer2');

SET IDENTITY_INSERT Users OFF;
GO

-- ============================================================
-- 2. STAFF PROFILES
-- ============================================================

INSERT INTO Staffs (UserId, DateJoined, SubjectHandled, Remarks)
VALUES
  (2, '2020-01-15', 'Administration', 'Manager'),
  (3, '2021-06-01', 'Fine Arts',      'Evaluator');
GO

-- ============================================================
-- 3. STUDENT PROFILES
-- ============================================================

INSERT INTO Students (UserId, AdmissionNumber, AdmissionDate, DateOfBirth, Address)
VALUES
  (4, 'STU-2024-001', '2024-09-01', '2005-03-15', N'123 Art Street, Creative City'),
  (5, 'STU-2024-002', '2024-09-01', '2005-07-22', N'456 Palette Ave, Design Town'),
  (6, 'STU-2024-003', '2024-09-01', '2005-11-08', N'789 Canvas Blvd, Art District');
GO

-- ============================================================
-- 4. CUSTOMER PROFILES
-- ============================================================

SET IDENTITY_INSERT Customers ON;

INSERT INTO Customers (Id, UserId, Address, Notes)
VALUES
  (1, 7, NULL, NULL),
  (2, 8, NULL, NULL);

SET IDENTITY_INSERT Customers OFF;
GO

-- ============================================================
-- 5. COMPETITIONS
-- ============================================================

SET IDENTITY_INSERT Competitions ON;

INSERT INTO Competitions (Id, Title, Description, StartDate, EndDate, CreatedBy, Status)
VALUES
  (1, N'Spring Art Competition 2025',  N'Annual spring competition celebrating creativity and artistic expression', '2025-03-01', '2025-05-31', 1, 'Completed'),
  (2, N'Digital Art Showcase 2025',    N'Explore the intersection of technology and traditional art forms',         '2025-06-01', '2025-08-31', 1, 'Completed'),
  (3, N'Abstract Expressions 2025',    N'A competition focused on abstract and experimental art techniques',        '2025-09-01', '2025-11-30', 1, 'Ongoing'),
  (4, N'Winter Wonderland Art 2025',   N'Capture the magic of winter through your artistic vision',                 '2025-12-01', '2026-02-28', 1, 'Upcoming');

SET IDENTITY_INSERT Competitions OFF;
GO

-- ============================================================
-- 6. COMPETITION CRITERIA (weights must sum to 100 per competition)
--    Criteria IDs from IoFA1.sql seed:
--      1=CREATIVITY, 2=COMPLETION, 3=SKILLS, 4=COMPOSITION
-- ============================================================

-- Temporarily disable the weight-sum trigger for bulk insert
DISABLE TRIGGER TRG_CompetitionCriteria_WeightSum_100 ON CompetitionCriteria;

INSERT INTO CompetitionCriteria (CompetitionId, CriteriaId, WeightPercent)
VALUES
  -- Competition 1
  (1, 1, 25.00), (1, 2, 25.00), (1, 3, 25.00), (1, 4, 25.00),
  -- Competition 2
  (2, 1, 25.00), (2, 2, 25.00), (2, 3, 25.00), (2, 4, 25.00),
  -- Competition 3
  (3, 1, 25.00), (3, 2, 25.00), (3, 3, 25.00), (3, 4, 25.00),
  -- Competition 4
  (4, 1, 25.00), (4, 2, 25.00), (4, 3, 25.00), (4, 4, 25.00);

ENABLE TRIGGER TRG_CompetitionCriteria_WeightSum_100 ON CompetitionCriteria;
GO

-- ============================================================
-- 7. SUBMISSIONS
-- ============================================================

-- Disable notification trigger during seed
DISABLE TRIGGER TRG_Notif_ExhibitionAdded ON ExhibitionSubmissions;

SET IDENTITY_INSERT Submissions ON;

INSERT INTO Submissions (Id, CompetitionId, StudentId, Title, WorkUrl, ProposedPrice, SubmittedAt)
VALUES
  (1, 1, 4, N'Blooming Dreams',     'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', 2000000, '2025-03-15T00:00:00+00:00'),
  (2, 1, 5, N'Urban Geometry',      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 1500000, '2025-03-20T00:00:00+00:00'),
  (3, 2, 4, N'Digital Dreamscape',  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', 2500000, '2025-06-10T00:00:00+00:00'),
  (4, 2, 6, N'Neon Nights',         'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400', 1800000, '2025-06-15T00:00:00+00:00'),
  (5, 3, 5, N'Abstract Harmony',    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', 3000000, '2025-09-10T00:00:00+00:00'),
  (6, 3, 6, N'Chaos Theory',        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400', 2200000, '2025-09-15T00:00:00+00:00');

SET IDENTITY_INSERT Submissions OFF;
GO

-- ============================================================
-- 8. SUBMISSION REVIEWS
-- ============================================================

-- Disable auto-notification trigger during seed
DISABLE TRIGGER TRG_Notif_SubmissionReviewed ON SubmissionReviews;

SET IDENTITY_INSERT SubmissionReviews ON;

INSERT INTO SubmissionReviews (Id, SubmissionId, StaffId, RatingLevel, Strengths, Weaknesses, Improvements, ReviewedAt)
VALUES
  (1, 1, 3, 'Best',   N'Exceptional use of color and composition',      N'Minor perspective issues in background',    N'Consider adding more depth to the background elements', '2025-04-01T00:00:00+00:00'),
  (2, 2, 3, 'Better', N'Strong geometric composition and clean lines',   N'Color palette could be more varied',         N'Experiment with warmer tones to add visual interest',    '2025-04-05T00:00:00+00:00'),
  (3, 3, 3, 'Best',   N'Innovative use of digital techniques',           N'Some areas lack detail',                     N'Add more intricate details to the foreground',           '2025-07-01T00:00:00+00:00'),
  (4, 4, 3, 'Good',   N'Vibrant color usage and mood',                   N'Composition could be more balanced',         N'Work on the rule of thirds for better composition',      '2025-07-10T00:00:00+00:00');

SET IDENTITY_INSERT SubmissionReviews OFF;

ENABLE TRIGGER TRG_Notif_SubmissionReviewed ON SubmissionReviews;
GO

-- ============================================================
-- 9. GRADE DETAILS
--    Criteria: 1=Creativity, 2=Completion, 3=Skills, 4=Composition
-- ============================================================

INSERT INTO GradeDetails (ReviewId, CriteriaId, RawScore)
VALUES
  -- Review 1 (Blooming Dreams - Best)
  (1, 1, 95.00), (1, 2, 90.00), (1, 3, 88.00), (1, 4, 92.00),
  -- Review 2 (Urban Geometry - Better)
  (2, 1, 82.00), (2, 2, 88.00), (2, 3, 85.00), (2, 4, 90.00),
  -- Review 3 (Digital Dreamscape - Best)
  (3, 1, 96.00), (3, 2, 85.00), (3, 3, 92.00), (3, 4, 88.00),
  -- Review 4 (Neon Nights - Good)
  (4, 1, 78.00), (4, 2, 82.00), (4, 3, 75.00), (4, 4, 70.00);
GO

-- ============================================================
-- 10. AWARDS
-- ============================================================

SET IDENTITY_INSERT Awards ON;

INSERT INTO Awards (Id, AwardName, Description)
VALUES
  (1, N'First Prize',  N'Awarded to the best submission in the competition'),
  (2, N'Second Prize', N'Awarded to the second-best submission in the competition'),
  (3, N'Third Prize',  N'Awarded to the third-best submission in the competition');

SET IDENTITY_INSERT Awards OFF;
GO

-- ============================================================
-- 11. STUDENT AWARDS
-- ============================================================

-- Disable auto-notification trigger during seed
DISABLE TRIGGER TRG_Notif_AwardGranted ON StudentAwards;

SET IDENTITY_INSERT StudentAwards ON;

INSERT INTO StudentAwards (Id, SubmissionId, AwardId, AwardedBy, AwardedDate)
VALUES
  (1, 1, 1, 1, '2025-06-01'),  -- Alice: First Prize, Spring Art Competition
  (2, 3, 1, 1, '2025-09-01'),  -- Alice: First Prize, Digital Art Showcase
  (3, 2, 2, 1, '2025-06-01');  -- Bob:   Second Prize, Spring Art Competition

SET IDENTITY_INSERT StudentAwards OFF;

ENABLE TRIGGER TRG_Notif_AwardGranted ON StudentAwards;
GO

-- ============================================================
-- 12. EXHIBITIONS
-- ============================================================

SET IDENTITY_INSERT Exhibitions ON;

INSERT INTO Exhibitions (Id, Title, Location, StartDate, EndDate, Status)
VALUES
  (1, N'Spring Gallery 2025',        N'Main Hall, IFA Campus',  '2025-07-01', '2025-07-31', 'Completed'),
  (2, N'Digital Art Exhibition 2025', N'Gallery B, IFA Campus', '2025-10-01', '2025-10-31', 'Completed');

SET IDENTITY_INSERT Exhibitions OFF;
GO

-- ============================================================
-- 13. EXHIBITION SUBMISSIONS
-- ============================================================

SET IDENTITY_INSERT ExhibitionSubmissions ON;

INSERT INTO ExhibitionSubmissions (Id, ExhibitionId, SubmissionId, ProposedPrice, Status)
VALUES
  (1, 1, 1, 2000000, 'Sold'),       -- Blooming Dreams in Spring Gallery
  (2, 1, 2, 1500000, 'Available'),  -- Urban Geometry in Spring Gallery
  (3, 2, 3, 2500000, 'Available'),  -- Digital Dreamscape in Digital Art Exhibition
  (4, 2, 4, 1800000, 'Sold');       -- Neon Nights in Digital Art Exhibition

SET IDENTITY_INSERT ExhibitionSubmissions OFF;

ENABLE TRIGGER TRG_Notif_ExhibitionAdded ON ExhibitionSubmissions;
GO

-- ============================================================
-- 14. SALES
--    CustomerId references Customers.Id (1=Customer One, 2=Customer Two)
-- ============================================================

-- Disable auto-notification trigger during seed
DISABLE TRIGGER TRG_Notif_ArtworkSold ON Sales;

SET IDENTITY_INSERT Sales ON;

INSERT INTO Sales (Id, ExhibitionSubmissionId, CustomerId, SoldPrice, SoldDate)
VALUES
  (1, 1, 1, 2200000, '2025-07-15'),  -- Blooming Dreams sold to Customer One
  (2, 4, 2, 1900000, '2025-10-20'); -- Neon Nights sold to Customer Two

SET IDENTITY_INSERT Sales OFF;

ENABLE TRIGGER TRG_Notif_ArtworkSold ON Sales;
GO

-- ============================================================
-- 15. NOTIFICATIONS (manual seed — triggers disabled above)
-- ============================================================

SET IDENTITY_INSERT Notifications ON;

INSERT INTO Notifications (Id, UserId, Type, Title, Message, IsRead, Link, SubmissionId, CompetitionId, AwardId, ExhibitionId, CreatedAt)
VALUES
  (1, 4, 'submission', N'Submission Evaluated',        N'Your submission "Blooming Dreams" has been rated as "Best".',                    0, N'/dashboard/my-submissions', 1, 1, NULL, NULL, '2025-04-01T00:00:00+00:00'),
  (2, 4, 'award',      N'Congratulations! Award Won',  N'You won "First Prize" for your submission "Blooming Dreams".',                   0, N'/dashboard/my-awards',       1, NULL, 1,   NULL, '2025-06-01T00:00:00+00:00'),
  (3, 5, 'submission', N'Submission Evaluated',        N'Your submission "Urban Geometry" has been rated as "Better".',                   1, N'/dashboard/my-submissions', 2, 1, NULL, NULL, '2025-04-05T00:00:00+00:00'),
  (4, 5, 'award',      N'Congratulations! Award Won',  N'You won "Second Prize" for your submission "Urban Geometry".',                   0, N'/dashboard/my-awards',       2, NULL, 2,   NULL, '2025-06-01T00:00:00+00:00'),
  (5, 3, 'submission', N'New Submission Received',     N'New submission received for Spring Art Competition 2025.',                       1, N'/dashboard/submissions',    NULL, 1, NULL, NULL, '2025-03-15T00:00:00+00:00');

SET IDENTITY_INSERT Notifications OFF;
GO

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'Users'               AS [Table], COUNT(*) AS [Rows] FROM Users
UNION ALL SELECT 'Staffs',              COUNT(*) FROM Staffs
UNION ALL SELECT 'Students',            COUNT(*) FROM Students
UNION ALL SELECT 'Customers',           COUNT(*) FROM Customers
UNION ALL SELECT 'Competitions',        COUNT(*) FROM Competitions
UNION ALL SELECT 'CompetitionCriteria', COUNT(*) FROM CompetitionCriteria
UNION ALL SELECT 'Submissions',         COUNT(*) FROM Submissions
UNION ALL SELECT 'SubmissionReviews',   COUNT(*) FROM SubmissionReviews
UNION ALL SELECT 'GradeDetails',        COUNT(*) FROM GradeDetails
UNION ALL SELECT 'Awards',              COUNT(*) FROM Awards
UNION ALL SELECT 'StudentAwards',       COUNT(*) FROM StudentAwards
UNION ALL SELECT 'Exhibitions',         COUNT(*) FROM Exhibitions
UNION ALL SELECT 'ExhibitionSubmissions', COUNT(*) FROM ExhibitionSubmissions
UNION ALL SELECT 'Sales',               COUNT(*) FROM Sales
UNION ALL SELECT 'Notifications',       COUNT(*) FROM Notifications;
GO
