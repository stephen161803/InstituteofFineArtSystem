-- ============================================================
-- IoFA Extra Seed Data (from mockData-older)
-- Run AFTER SeedData.sql
-- Adds more users, competitions, submissions, awards, exhibitions, notifications
-- ============================================================

USE FineArtsInstitute_Final;
GO

-- ============================================================
-- 1. EXTRA USERS (IDs 9-18)
--    RoleId: 3=Staff, 4=Student, 5=Customer
-- ============================================================
SET IDENTITY_INSERT Users ON;

INSERT INTO Users (Id, Username, PasswordHash, FullName, Email, Phone, IsActive, RoleId, AvatarUrl)
VALUES
  (9,  'staff2',   'password123', 'Robert Brown',    'teacher2@artschool.com', '555-0102', 1, 3, 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert'),
  (10, 'staff3',   'password123', 'Lisa Anderson',   'teacher3@artschool.com', '555-0103', 1, 3, 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'),
  (11, 'diana',    'password123', 'Diana Martinez',  'diana@student.ifa.edu',  '555-0204', 1, 4, 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana'),
  (12, 'emma',     'password123', 'Emma Wilson',     'emma@student.ifa.edu',   '555-0205', 1, 4, 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'),
  (13, 'charlie',  'password123', 'Charlie Chen',    'charlie@student.ifa.edu','555-0203', 1, 4, 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'),
  (14, 'michael',  'password123', 'Michael Brown',   'customer1@gmail.com',    '555-1001', 1, 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'),
  (15, 'jessica',  'password123', 'Jessica Taylor',  'customer2@gmail.com',    '555-1002', 1, 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica');

SET IDENTITY_INSERT Users OFF;
GO

-- ============================================================
-- 2. EXTRA STAFF PROFILES
-- ============================================================
INSERT INTO Staffs (UserId, DateJoined, SubjectHandled, Remarks)
VALUES
  (9,  '2021-09-20', 'Art & Design', 'Innovative teaching methods'),
  (10, '2022-10-25', 'Art & Design', 'Passionate about art education');
GO

-- ============================================================
-- 3. EXTRA STUDENT PROFILES
-- ============================================================
INSERT INTO Students (UserId, AdmissionNumber, AdmissionDate, DateOfBirth, Address)
VALUES
  (11, 'STU-2024-004', '2024-09-01', '2005-05-10', N'321 Sculpture Lane, Art District'),
  (12, 'STU-2024-005', '2024-09-01', '2005-08-19', N'654 Mixed Media Rd, Creative City'),
  (13, 'STU-2024-006', '2024-09-01', '2005-02-27', N'987 Digital Ave, Design Town');
GO

-- ============================================================
-- 4. EXTRA CUSTOMER PROFILES
-- ============================================================
SET IDENTITY_INSERT Customers ON;

INSERT INTO Customers (Id, UserId, Address, Notes)
VALUES
  (3, 14, N'123 Oak Street, New York',      N'Prefers careful packaging'),
  (4, 15, N'456 Maple Avenue, Los Angeles', N'Collector, loves dynamic compositions');

SET IDENTITY_INSERT Customers OFF;
GO

-- ============================================================
-- 5. EXTRA COMPETITIONS (IDs 5-10)
-- ============================================================
SET IDENTITY_INSERT Competitions ON;

INSERT INTO Competitions (Id, Title, Description, StartDate, EndDate, CreatedBy, Status)
VALUES
  (5,  N'Spring Art Festival 2026',        N'Celebrate spring with vibrant paintings',                                    '2026-03-01', '2026-03-31', 3,  'Ongoing'),
  (6,  N'Abstract Expression Contest',     N'Explore abstract art techniques. Any medium accepted',                       '2026-04-01', '2026-04-30', 9,  'Upcoming'),
  (7,  N'Winter Wonderland 2025',          N'Winter themed artwork competition',                                           '2025-12-01', '2026-01-15', 3,  'Completed'),
  (8,  N'Summer Creativity Challenge 2025',N'Showcase your creativity with summer-inspired artwork',                       '2025-06-01', '2025-08-31', 10, 'Completed'),
  (9,  N'Nature Photography Challenge',    N'Capture the beauty of nature through your lens. Max 3 submissions/student',  '2026-03-15', '2026-04-15', 9,  'Ongoing'),
  (10, N'Digital Art Revolution 2026',     N'Push the boundaries of digital art and animation',                           '2026-05-01', '2026-06-30', 10, 'Upcoming');

SET IDENTITY_INSERT Competitions OFF;
GO

-- ============================================================
-- 6. COMPETITION CRITERIA for new competitions (IDs 5-10)
-- ============================================================
DISABLE TRIGGER TRG_CompetitionCriteria_WeightSum_100 ON CompetitionCriteria;

INSERT INTO CompetitionCriteria (CompetitionId, CriteriaId, WeightPercent)
VALUES
  (5,  1, 25.00), (5,  2, 25.00), (5,  3, 25.00), (5,  4, 25.00),
  (6,  1, 25.00), (6,  2, 25.00), (6,  3, 25.00), (6,  4, 25.00),
  (7,  1, 25.00), (7,  2, 25.00), (7,  3, 25.00), (7,  4, 25.00),
  (8,  1, 25.00), (8,  2, 25.00), (8,  3, 25.00), (8,  4, 25.00),
  (9,  1, 25.00), (9,  2, 25.00), (9,  3, 25.00), (9,  4, 25.00),
  (10, 1, 25.00), (10, 2, 25.00), (10, 3, 25.00), (10, 4, 25.00);

ENABLE TRIGGER TRG_CompetitionCriteria_WeightSum_100 ON CompetitionCriteria;
GO

-- ============================================================
-- 7. EXTRA SUBMISSIONS (IDs 7-31)
--    StudentId maps to Users.Id: Alice=4, Bob=5, Carol=6, Diana=11, Emma=12, Charlie=13
-- ============================================================
DISABLE TRIGGER TRG_Notif_ExhibitionAdded ON ExhibitionSubmissions;

SET IDENTITY_INSERT Submissions ON;

INSERT INTO Submissions (Id, CompetitionId, StudentId, Title, WorkUrl, Description, Quotation, Poem, ProposedPrice, SubmittedAt)
VALUES
  -- Spring Art Festival 2026 (Comp 5) - Ongoing
  (7,  5, 4,  N'Blooming Spring',      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', N'A vibrant representation of spring awakening',          N'Where flowers bloom, so does hope',                NULL, 2500000, '2026-03-05T00:00:00+00:00'),
  (8,  5, 5,  N'Spring Meadow',        'https://images.unsplash.com/photo-1579783902614-a3fb3b4ae5f1?w=800', N'A peaceful spring landscape',                           NULL, N'In fields of green and skies of blue, Spring whispers softly fresh and new', 1800000, '2026-03-08T00:00:00+00:00'),
  (9,  5, 13, N'Cherry Blossom Dance', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', N'Delicate cherry blossoms in full bloom',                 N'Beauty in fleeting moments',                       NULL, 2100000, '2026-03-10T00:00:00+00:00'),
  (10, 5, 11, N'Butterfly Garden',     'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800', N'A colorful garden full of spring butterflies',           NULL,                                                 NULL, 1900000, '2026-03-12T00:00:00+00:00'),
  (11, 5, 12, N'Rain and Renewal',     'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', N'Spring rain bringing life to the earth',                 NULL, N'Raindrops fall on petals bright, Nature''s blessing pure delight', 1600000, '2026-03-15T00:00:00+00:00'),

  -- Winter Wonderland 2025 (Comp 7) - Completed
  (12, 7, 4,  N'Frozen Serenity',      'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=800', N'Winter landscape with snow-covered mountains',           NULL,                                                 NULL, 3000000, '2025-12-15T00:00:00+00:00'),
  (13, 7, 5,  N'Silent Snowfall',      'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800', N'Peaceful winter evening with falling snow',              N'In the silence of snow, peace is found',           NULL, 2200000, '2025-12-18T00:00:00+00:00'),
  (14, 7, 13, N'Winter Forest',        'https://images.unsplash.com/photo-1487349384428-12b47aca925e?w=800', N'Snow-laden trees in a quiet forest',                     NULL,                                                 NULL, 2800000, '2025-12-20T00:00:00+00:00'),
  (15, 7, 11, N'Ice Crystal Magic',    'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800', N'Close-up of intricate ice crystals',                     N'Nature''s frozen artistry',                        NULL, 1700000, '2025-12-22T00:00:00+00:00'),
  (16, 7, 12, N'Aurora Dreams',        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', N'Northern lights over snowy landscape',                   NULL,                                                 NULL, 2400000, '2025-12-25T00:00:00+00:00'),

  -- Summer Creativity Challenge 2025 (Comp 8) - Completed
  (17, 8, 4,  N'Beach Paradise',       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', N'Tropical beach with crystal clear water',                N'Summer is a state of mind',                        NULL, 3500000, '2025-07-10T00:00:00+00:00'),
  (18, 8, 5,  N'Sunset Sailing',       'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800', N'Sailboat at sunset on calm waters',                      NULL, N'Golden sun meets gentle sea, Summer''s perfect harmony', 2700000, '2025-07-15T00:00:00+00:00'),
  (19, 8, 13, N'Summer Rain',          'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', N'Refreshing summer shower in the garden',                 NULL,                                                 NULL, 1500000, '2025-07-20T00:00:00+00:00'),
  (20, 8, 11, N'Mountain Adventure',   'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', N'Summer hiking in the mountains',                         N'Adventure awaits in every season',                 NULL, 4200000, '2025-08-01T00:00:00+00:00'),
  (21, 8, 12, N'Sunflower Fields',     'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800', N'Endless fields of blooming sunflowers',                  NULL,                                                 NULL, 2000000, '2025-08-10T00:00:00+00:00'),
  (22, 8, 4,  N'Ice Cream Dreams',     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', N'Colorful summer treats and beach vibes',                 N'Life is better with ice cream',                    NULL, 1800000, '2025-08-15T00:00:00+00:00'),
  (23, 8, 5,  N'Lakeside Serenity',    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', N'Peaceful summer day by the lake',                        NULL, N'By the lake so calm and clear, Summer''s beauty brings us near', 2300000, '2025-08-20T00:00:00+00:00'),
  (24, 8, 13, N'Tropical Paradise',    'https://images.unsplash.com/photo-1496989981497-27d69cdad83e?w=800', N'Lush tropical jungle in summer',                         NULL,                                                 NULL, 1900000, '2025-08-22T00:00:00+00:00'),
  (25, 8, 11, N'Campfire Nights',      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', N'Summer camping under the stars',                         NULL,                                                 NULL, 3200000, '2025-08-25T00:00:00+00:00'),
  (26, 8, 12, N'Summer Memories',      'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800', N'Collection of summer moments and joy',                   N'Summer: a season of endless possibilities',        NULL, 2100000, '2025-08-28T00:00:00+00:00'),

  -- Nature Photography Challenge (Comp 9) - Ongoing, unreviewed
  (27, 9, 4,  N'Forest Path',          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', N'A serene path winding through an ancient forest',        N'Into the forest I go, to lose my mind and find my soul', NULL, 2800000, '2026-03-20T00:00:00+00:00'),
  (28, 9, 5,  N'Mountain Majesty',     'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800', N'Majestic mountain peaks rising above the clouds',        NULL, N'Mountains stand so tall and grand, Nature''s monument forever grand', 1900000, '2026-03-21T00:00:00+00:00'),
  (29, 9, 13, N'Autumn Reflections',   'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', N'Perfect mirror reflection of autumn trees on a still lake', NULL,                                              NULL, 2200000, '2026-03-22T00:00:00+00:00'),
  (30, 9, 11, N'Coastal Sunset',       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', N'Dramatic sunset over rocky coastline with crashing waves', N'The ocean stirs the heart, inspires the imagination', NULL, 2900000, '2026-03-23T00:00:00+00:00'),
  (31, 9, 12, N'Wildlife Encounter',   'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800', N'A curious deer in its natural forest habitat',           NULL,                                                 NULL, 3300000, '2026-03-24T00:00:00+00:00');

SET IDENTITY_INSERT Submissions OFF;
GO

-- ============================================================
-- 8. SUBMISSION REVIEWS for completed competitions
-- ============================================================
DISABLE TRIGGER TRG_Notif_SubmissionReviewed ON SubmissionReviews;

SET IDENTITY_INSERT SubmissionReviews ON;

INSERT INTO SubmissionReviews (Id, SubmissionId, StaffId, RatingLevel, Strengths, Weaknesses, Improvements, ReviewedAt)
VALUES
  -- Winter Wonderland 2025
  (5,  12, 3, 'Best',   N'Perfect winter atmosphere, masterful technique',    N'None significant',                          N'Continue developing personal style',              '2026-01-16T00:00:00+00:00'),
  (6,  13, 3, 'Better', N'Excellent mood, good technique',                    N'Could use more contrast',                   N'Experiment with value contrast',                  '2026-01-16T00:00:00+00:00'),
  (7,  14, 3, 'Best',   N'Masterful composition, beautiful light',            N'Minor issues with perspective',             N'Continue studying perspective',                   '2026-01-16T00:00:00+00:00'),
  (8,  15, 3, 'Good',   N'Creative concept, good detail work',                N'Needs more depth',                          N'Work on creating depth',                          '2026-01-16T00:00:00+00:00'),
  (9,  16, 3, 'Better', N'Bold color choices, imaginative',                   N'Execution needs refinement',                N'Practice blending techniques',                    '2026-01-16T00:00:00+00:00'),
  -- Summer Creativity Challenge 2025
  (10, 17, 3, 'Best',   N'Perfect color palette, great atmosphere',           N'None significant',                          N'Continue exploring marine themes',                '2025-09-01T00:00:00+00:00'),
  (11, 18, 3, 'Better', N'Excellent use of warm colors',                      N'Boat proportions slightly off',             N'Study nautical subjects',                         '2025-09-01T00:00:00+00:00'),
  (12, 19, 3, 'Good',   N'Good atmospheric effects',                          N'Could be more dynamic',                     N'Work on movement and energy',                     '2025-09-01T00:00:00+00:00'),
  (13, 20, 3, 'Best',   N'Great composition, strong sense of place',          N'Some color harmony issues',                 N'Study color theory',                              '2025-09-01T00:00:00+00:00'),
  (14, 21, 3, 'Better', N'Happy mood, good use of yellows',                   N'Repetitive elements need variation',        N'Add more variety in composition',                 '2025-09-01T00:00:00+00:00'),
  (15, 22, 3, 'Good',   N'Creative concept, vibrant colors',                  N'Needs better focal point',                  N'Study composition hierarchy',                     '2025-09-01T00:00:00+00:00'),
  (16, 23, 3, 'Better', N'Excellent reflections, serene mood',                N'Could use more detail',                     N'Practice fine details',                           '2025-09-01T00:00:00+00:00'),
  (17, 24, 3, 'Good',   N'Bold colors, lush feeling',                         N'Overwhelming detail',                       N'Learn to simplify',                               '2025-09-01T00:00:00+00:00'),
  (18, 25, 3, 'Best',   N'Perfect mood, beautiful lighting',                  N'Minor anatomy issues',                      N'Continue figure studies',                         '2025-09-01T00:00:00+00:00'),
  (19, 26, 3, 'Better', N'Unique approach, good variety',                     N'Unity needs improvement',                   N'Work on creating cohesion',                       '2025-09-01T00:00:00+00:00'),
  -- Spring Art Festival 2026 (partial reviews)
  (20, 7,  3, 'Best',   N'Outstanding use of color and composition',          N'Minor perspective issue in background',     N'Work on depth perception',                        '2026-03-16T00:00:00+00:00'),
  (21, 8,  3, 'Better', N'Nice composition and color harmony',                N'Could use more detail in foreground',       N'Focus on texture and detail work',                '2026-03-16T00:00:00+00:00'),
  (22, 9,  3, 'Good',   N'Beautiful color work, delicate brushstrokes',       N'Composition could be stronger',             N'Study composition techniques',                    '2026-03-16T00:00:00+00:00');

SET IDENTITY_INSERT SubmissionReviews OFF;

ENABLE TRIGGER TRG_Notif_SubmissionReviewed ON SubmissionReviews;
GO

-- ============================================================
-- 9. GRADE DETAILS for new reviews (IDs 5-22)
-- ============================================================
INSERT INTO GradeDetails (ReviewId, CriteriaId, RawScore)
VALUES
  -- Review 5 (Frozen Serenity - Best)
  (5, 1, 96.00), (5, 2, 94.00), (5, 3, 95.00), (5, 4, 97.00),
  -- Review 6 (Silent Snowfall - Better)
  (6, 1, 84.00), (6, 2, 86.00), (6, 3, 83.00), (6, 4, 85.00),
  -- Review 7 (Winter Forest - Best)
  (7, 1, 93.00), (7, 2, 91.00), (7, 3, 94.00), (7, 4, 92.00),
  -- Review 8 (Ice Crystal Magic - Good)
  (8, 1, 76.00), (8, 2, 78.00), (8, 3, 74.00), (8, 4, 72.00),
  -- Review 9 (Aurora Dreams - Better)
  (9, 1, 87.00), (9, 2, 83.00), (9, 3, 85.00), (9, 4, 84.00),
  -- Review 10 (Beach Paradise - Best)
  (10, 1, 97.00), (10, 2, 95.00), (10, 3, 96.00), (10, 4, 98.00),
  -- Review 11 (Sunset Sailing - Better)
  (11, 1, 85.00), (11, 2, 87.00), (11, 3, 84.00), (11, 4, 86.00),
  -- Review 12 (Summer Rain - Good)
  (12, 1, 74.00), (12, 2, 76.00), (12, 3, 73.00), (12, 4, 75.00),
  -- Review 13 (Mountain Adventure - Best)
  (13, 1, 94.00), (13, 2, 92.00), (13, 3, 93.00), (13, 4, 91.00),
  -- Review 14 (Sunflower Fields - Better)
  (14, 1, 83.00), (14, 2, 85.00), (14, 3, 82.00), (14, 4, 84.00),
  -- Review 15 (Ice Cream Dreams - Good)
  (15, 1, 77.00), (15, 2, 79.00), (15, 3, 76.00), (15, 4, 78.00),
  -- Review 16 (Lakeside Serenity - Better)
  (16, 1, 86.00), (16, 2, 88.00), (16, 3, 85.00), (16, 4, 87.00),
  -- Review 17 (Tropical Paradise - Good)
  (17, 1, 75.00), (17, 2, 77.00), (17, 3, 74.00), (17, 4, 76.00),
  -- Review 18 (Campfire Nights - Best)
  (18, 1, 95.00), (18, 2, 93.00), (18, 3, 94.00), (18, 4, 96.00),
  -- Review 19 (Summer Memories - Better)
  (19, 1, 84.00), (19, 2, 86.00), (19, 3, 83.00), (19, 4, 85.00),
  -- Review 20 (Blooming Spring - Best)
  (20, 1, 95.00), (20, 2, 90.00), (20, 3, 88.00), (20, 4, 92.00),
  -- Review 21 (Spring Meadow - Better)
  (21, 1, 82.00), (21, 2, 84.00), (21, 3, 81.00), (21, 4, 83.00),
  -- Review 22 (Cherry Blossom Dance - Good)
  (22, 1, 76.00), (22, 2, 78.00), (22, 3, 75.00), (22, 4, 77.00);
GO

-- ============================================================
-- 10. EXTRA AWARDS (IDs 4-11)
-- ============================================================
SET IDENTITY_INSERT Awards ON;

INSERT INTO Awards (Id, AwardName, Description)
VALUES
  (4, N'Honorable Mention', N'Special recognition for outstanding creativity'),
  (5, N'Best Use of Color', N'Awarded for exceptional use of color in artwork');

SET IDENTITY_INSERT Awards OFF;
GO

-- ============================================================
-- 11. EXTRA STUDENT AWARDS (IDs 4-11)
-- ============================================================
DISABLE TRIGGER TRG_Notif_AwardGranted ON StudentAwards;

SET IDENTITY_INSERT StudentAwards ON;

INSERT INTO StudentAwards (Id, SubmissionId, AwardId, AwardedBy, AwardedDate)
VALUES
  -- Winter Wonderland 2025
  (4,  12, 1, 1, '2026-01-20'),  -- Alice: 1st Prize (Frozen Serenity)
  (5,  14, 2, 1, '2026-01-20'),  -- Charlie: 2nd Prize (Winter Forest)
  (6,  13, 3, 1, '2026-01-20'),  -- Bob: 3rd Prize (Silent Snowfall)
  -- Summer Creativity Challenge 2025
  (7,  17, 1, 1, '2025-09-05'),  -- Alice: 1st Prize (Beach Paradise)
  (8,  20, 2, 1, '2025-09-05'),  -- Diana: 2nd Prize (Mountain Adventure)
  (9,  25, 3, 1, '2025-09-05'),  -- Diana: 3rd Prize (Campfire Nights)
  (10, 21, 4, 1, '2025-09-05'),  -- Emma: Honorable Mention (Sunflower Fields)
  (11, 18, 5, 1, '2025-09-05');  -- Bob: Best Use of Color (Sunset Sailing)

SET IDENTITY_INSERT StudentAwards OFF;

ENABLE TRIGGER TRG_Notif_AwardGranted ON StudentAwards;
GO

-- ============================================================
-- 12. EXTRA EXHIBITIONS (IDs 3-5)
-- ============================================================
SET IDENTITY_INSERT Exhibitions ON;

INSERT INTO Exhibitions (Id, Title, Location, StartDate, EndDate, Status)
VALUES
  (3, N'Contemporary Digital Art 2026', N'Museum of Modern Art, New York',          '2026-03-01', '2026-04-30', 'Ongoing'),
  (4, N'Spring Watercolor Festival',    N'Art Gallery Downtown, Los Angeles',        '2026-02-15', '2026-04-15', 'Ongoing'),
  (5, N'Nature Photography Showcase',   N'Chicago Photography Center, Illinois',     '2026-05-01', '2026-06-15', 'Upcoming');

SET IDENTITY_INSERT Exhibitions OFF;
GO

-- ============================================================
-- 13. EXTRA EXHIBITION SUBMISSIONS (IDs 5-14)
-- ============================================================
SET IDENTITY_INSERT ExhibitionSubmissions ON;

INSERT INTO ExhibitionSubmissions (Id, ExhibitionId, SubmissionId, ProposedPrice, Status)
VALUES
  -- Exhibition 3: Contemporary Digital Art 2026
  (5,  3, 7,  2500000, 'Available'),  -- Blooming Spring
  (6,  3, 8,  1800000, 'Sold'),       -- Spring Meadow
  (7,  3, 11, 1600000, 'Available'),  -- Rain and Renewal
  -- Exhibition 4: Spring Watercolor Festival
  (8,  4, 12, 3000000, 'Available'),  -- Frozen Serenity
  (9,  4, 9,  2100000, 'Sold'),       -- Cherry Blossom Dance
  -- Exhibition 5: Nature Photography Showcase (Upcoming)
  (10, 5, 27, 2800000, 'Available'),  -- Forest Path
  (11, 5, 28, 1900000, 'Available'),  -- Mountain Majesty
  (12, 5, 29, 2200000, 'Available'),  -- Autumn Reflections
  (13, 5, 30, 2900000, 'Available'),  -- Coastal Sunset
  (14, 5, 31, 3300000, 'Available');  -- Wildlife Encounter

SET IDENTITY_INSERT ExhibitionSubmissions OFF;

ENABLE TRIGGER TRG_Notif_ExhibitionAdded ON ExhibitionSubmissions;
GO

-- ============================================================
-- 14. EXTRA SALES (IDs 3-6)
-- ============================================================
DISABLE TRIGGER TRG_Notif_ArtworkSold ON Sales;

SET IDENTITY_INSERT Sales ON;

INSERT INTO Sales (Id, ExhibitionSubmissionId, CustomerId, SoldPrice, SoldDate)
VALUES
  (3, 6,  3, 2200000, '2026-03-12'),  -- Spring Meadow → Michael Brown
  (4, 9,  4, 2400000, '2026-03-08'),  -- Cherry Blossom Dance → Jessica Taylor
  (5, 8,  3, 3500000, '2026-03-01'),  -- Frozen Serenity → Michael Brown
  (6, 7,  4, 4200000, '2026-03-10');  -- Rain and Renewal → Jessica Taylor

SET IDENTITY_INSERT Sales OFF;

ENABLE TRIGGER TRG_Notif_ArtworkSold ON Sales;
GO

-- ============================================================
-- 15. EXTRA NOTIFICATIONS (IDs 6-25)
-- ============================================================
SET IDENTITY_INSERT Notifications ON;

INSERT INTO Notifications (Id, UserId, Type, Title, Message, IsRead, Link, SubmissionId, CompetitionId, AwardId, ExhibitionId, CreatedAt)
VALUES
  -- Alice (UserId=4)
  (6,  4, 'award',      N'Award Won - Winter Wonderland',    N'You won First Prize for "Frozen Serenity" in Winter Wonderland 2025',          0, N'/dashboard/my-awards',       12, NULL, 4,  NULL, '2026-01-20T11:00:00+00:00'),
  (7,  4, 'award',      N'Award Won - Summer Challenge',     N'You won First Prize for "Beach Paradise" in Summer Creativity Challenge 2025',  0, N'/dashboard/my-awards',       17, NULL, 7,  NULL, '2025-09-05T14:00:00+00:00'),
  (8,  4, 'submission', N'Submission Evaluated',             N'Your submission "Blooming Spring" has been rated as "Best"',                    0, N'/dashboard/my-submissions',  7,  5,   NULL, NULL, '2026-03-16T00:00:00+00:00'),
  (9,  4, 'exhibition', N'Artwork in Exhibition',            N'Your artwork "Blooming Spring" is featured in Contemporary Digital Art 2026',   1, N'/dashboard/my-submissions',  7,  NULL, NULL, 3,  '2026-03-01T10:00:00+00:00'),
  (10, 4, 'purchase',   N'Artwork Sold',                     N'"Frozen Serenity" was sold for 3,500,000 VND at Spring Watercolor Festival',    0, N'/dashboard/my-submissions',  12, NULL, NULL, 4,  '2026-03-01T16:45:00+00:00'),

  -- Bob (UserId=5)
  (11, 5, 'award',      N'Award Won - Winter Wonderland',    N'You won Third Prize for "Silent Snowfall" in Winter Wonderland 2025',           0, N'/dashboard/my-awards',       13, NULL, 6,  NULL, '2026-01-20T11:00:00+00:00'),
  (12, 5, 'award',      N'Best Use of Color Award',          N'You received Best Use of Color award for "Sunset Sailing"',                     1, N'/dashboard/my-awards',       18, NULL, 11, NULL, '2025-09-05T14:30:00+00:00'),
  (13, 5, 'submission', N'Submission Evaluated',             N'Your submission "Spring Meadow" has been rated as "Better"',                    0, N'/dashboard/my-submissions',  8,  5,   NULL, NULL, '2026-03-16T00:00:00+00:00'),
  (14, 5, 'purchase',   N'Artwork Sold',                     N'"Spring Meadow" was sold for 2,200,000 VND at Contemporary Digital Art 2026',   0, N'/dashboard/my-submissions',  8,  NULL, NULL, 3,  '2026-03-12T13:45:00+00:00'),

  -- Charlie (UserId=13)
  (15, 13, 'award',     N'Award Won - Winter Wonderland',    N'You won Second Prize for "Winter Forest" in Winter Wonderland 2025',            0, N'/dashboard/my-awards',       14, NULL, 5,  NULL, '2026-01-20T11:00:00+00:00'),
  (16, 13, 'submission',N'Submission Evaluated',             N'Your submission "Cherry Blossom Dance" has been rated as "Good"',               0, N'/dashboard/my-submissions',  9,  5,   NULL, NULL, '2026-03-16T00:00:00+00:00'),
  (17, 13, 'purchase',  N'Artwork Sold',                     N'"Cherry Blossom Dance" was sold for 2,400,000 VND at Spring Watercolor Festival',0, N'/dashboard/my-submissions', 9,  NULL, NULL, 4,  '2026-03-08T10:00:00+00:00'),

  -- Diana (UserId=11)
  (18, 11, 'award',     N'Award Won - Summer Challenge',     N'You won Second Prize for "Mountain Adventure" in Summer Creativity Challenge',  0, N'/dashboard/my-awards',       20, NULL, 8,  NULL, '2025-09-05T14:00:00+00:00'),
  (19, 11, 'award',     N'Award Won - Summer Challenge',     N'You won Third Prize for "Campfire Nights" in Summer Creativity Challenge 2025', 0, N'/dashboard/my-awards',       25, NULL, 9,  NULL, '2025-09-05T14:00:00+00:00'),

  -- Emma (UserId=12)
  (20, 12, 'award',     N'Honorable Mention',                N'You received Honorable Mention for "Sunflower Fields" in Summer Challenge',     0, N'/dashboard/my-awards',       21, NULL, 10, NULL, '2025-09-05T14:00:00+00:00'),

  -- Staff (UserId=3)
  (21, 3, 'submission', N'New Submissions to Review',        N'5 new submissions received for Spring Art Festival 2026',                       0, N'/dashboard/submissions',     NULL, 5, NULL, NULL, '2026-03-15T10:00:00+00:00'),
  (22, 3, 'submission', N'New Submissions to Review',        N'5 new submissions received for Nature Photography Challenge',                   0, N'/dashboard/submissions',     NULL, 9, NULL, NULL, '2026-03-24T10:00:00+00:00'),
  (23, 3, 'exhibition', N'Exhibition Opening',               N'Contemporary Digital Art 2026 exhibition is now open',                          1, N'/dashboard/exhibitions',     NULL, NULL, NULL, 3, '2026-03-01T09:00:00+00:00'),

  -- Manager (UserId=2)
  (24, 2, 'competition',N'Competition Performance',          N'Spring Art Festival 2026 has 5 submissions with excellent quality',             0, N'/dashboard/submissions',     NULL, 5, NULL, NULL, '2026-03-16T10:00:00+00:00'),
  (25, 2, 'exhibition', N'Exhibition Statistics',            N'Contemporary Digital Art 2026 has received high visitor engagement',            0, N'/dashboard/exhibitions',     NULL, NULL, NULL, 3, '2026-03-10T09:00:00+00:00');

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
