
/* =============================================================================
DATABASE: FineArtsInstitute_Final (Normalized - WeightPercent 0-100, Keep Customers)
============================================================================= */

IF DB_ID('FineArtsInstitute_Final') IS NOT NULL
BEGIN
    ALTER DATABASE FineArtsInstitute_Final SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE FineArtsInstitute_Final;
END
GO

CREATE DATABASE FineArtsInstitute_Final;
GO
USE FineArtsInstitute_Final;
GO

-- =============================================
-- 1. NGƯỜI DÙNG & VAI TRÒ
-- =============================================
CREATE TABLE Roles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE -- Admin, Manager, Staff, Student, Customer
);

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Phone VARCHAR(15),
    IsActive BIT DEFAULT 1,
    RoleId INT NOT NULL,
    CreatedAt DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    AvatarUrl NVARCHAR(500) NULL,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

CREATE TABLE Students (
    UserId INT PRIMARY KEY,
    AdmissionNumber VARCHAR(20) UNIQUE NOT NULL,
    AdmissionDate DATE,
    DateOfBirth DATE,
    Address NVARCHAR(255),
    CONSTRAINT FK_Students_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Staffs (
    UserId INT PRIMARY KEY,
    DateJoined DATE,
    SubjectHandled NVARCHAR(100),
    Remarks NVARCHAR(MAX),
    CONSTRAINT FK_Staffs_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =============================================
-- 1.1 CUSTOMER (GIỮ BẢNG CUSTOMER, NHƯNG CUSTOMER LÀ 1 USER)
-- =============================================
CREATE TABLE Customers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL UNIQUE,               -- customer cũng là user
    Address NVARCHAR(255),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Customers_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =============================================
-- 2. CUỘC THI
-- =============================================
CREATE TABLE Competitions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    CreatedBy INT,
    Status NVARCHAR(50) DEFAULT 'Upcoming',
    CONSTRAINT FK_Competitions_Users_Creator FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- =============================================
-- 2.1 TIÊU CHÍ + TRỌNG SỐ THEO CUỘC THI (0-100%)
-- =============================================
CREATE TABLE Criteria (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CriteriaCode VARCHAR(50) NOT NULL UNIQUE,
    CriteriaName NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

CREATE TABLE CompetitionCriteria (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompetitionId INT NOT NULL,
    CriteriaId INT NOT NULL,
    WeightPercent DECIMAL(6,2) NOT NULL,  -- 0..100%

    CONSTRAINT UQ_CompetitionCriteria UNIQUE (CompetitionId, CriteriaId),
    CONSTRAINT FK_CC_Competition FOREIGN KEY (CompetitionId) REFERENCES Competitions(Id),
    CONSTRAINT FK_CC_Criteria FOREIGN KEY (CriteriaId) REFERENCES Criteria(Id),
    CONSTRAINT CK_CC_WeightPercent CHECK (WeightPercent > 0 AND WeightPercent <= 100)
);
GO

CREATE OR ALTER TRIGGER TRG_CompetitionCriteria_WeightSum_100
ON CompetitionCriteria
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Bad INT = 0;

    SELECT @Bad = COUNT(*)
    FROM (
        SELECT CompetitionId FROM inserted
        UNION
        SELECT CompetitionId FROM deleted
    ) AS ChangedCompetitions
    CROSS APPLY (
        SELECT COALESCE(SUM(WeightPercent), 0) AS TotalWeight
        FROM CompetitionCriteria
        WHERE CompetitionId = ChangedCompetitions.CompetitionId
    ) x
    WHERE ABS(x.TotalWeight - 100.0) > 0.01;

    IF @Bad > 0
    BEGIN
        RAISERROR (N'Tổng WeightPercent của mỗi cuộc thi phải bằng 100 (%)', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- =============================================
-- 3. BÀI NỘP & CHẤM ĐIỂM
-- =============================================
CREATE TABLE Submissions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CompetitionId INT NOT NULL,
    StudentId INT NOT NULL,
    Title NVARCHAR(200),
    WorkUrl NVARCHAR(500),
    ProposedPrice DECIMAL(18,2) DEFAULT 0,
    SubmittedAt DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Submissions_Competitions FOREIGN KEY (CompetitionId) REFERENCES Competitions(Id),
    CONSTRAINT FK_Submissions_Users FOREIGN KEY (StudentId) REFERENCES Users(Id)
);

CREATE TABLE SubmissionReviews (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SubmissionId INT NOT NULL UNIQUE,
    StaffId INT NOT NULL,

    RatingLevel NVARCHAR(20) NOT NULL, -- Best, Better, Good, Moderate, Normal, Disqualified
    Strengths NVARCHAR(MAX),
    Weaknesses NVARCHAR(MAX),
    Improvements NVARCHAR(MAX),
    ReviewedAt DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),

    CONSTRAINT CK_RatingLevel CHECK (RatingLevel IN (N'Best', N'Better', N'Good', N'Moderate', N'Normal', N'Disqualified')),
    CONSTRAINT FK_Reviews_Submissions FOREIGN KEY (SubmissionId) REFERENCES Submissions(Id),
    CONSTRAINT FK_Reviews_Staffs FOREIGN KEY (StaffId) REFERENCES Users(Id)
);

CREATE TABLE GradeDetails (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ReviewId INT NOT NULL,
    CriteriaId INT NOT NULL,
    RawScore DECIMAL(5,2) NOT NULL, -- 0..100

    CONSTRAINT UQ_ReviewCriteria UNIQUE (ReviewId, CriteriaId),
    CONSTRAINT FK_GradeDetails_Reviews FOREIGN KEY (ReviewId) REFERENCES SubmissionReviews(Id),
    CONSTRAINT FK_GradeDetails_Criteria FOREIGN KEY (CriteriaId) REFERENCES Criteria(Id),
    CONSTRAINT CK_GradeDetails_RawScore CHECK (RawScore >= 0 AND RawScore <= 100)
);

-- =============================================
-- 4. GIẢI THƯỞNG
-- =============================================
CREATE TABLE Awards (
    Id INT PRIMARY KEY IDENTITY(1,1),
    AwardName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX)
);

CREATE TABLE StudentAwards (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SubmissionId INT NOT NULL,
    AwardId INT NOT NULL,
    AwardedBy INT NOT NULL,
    AwardedDate DATE DEFAULT GETDATE(),

    CONSTRAINT FK_StudentAwards_Submissions FOREIGN KEY (SubmissionId) REFERENCES Submissions(Id),
    CONSTRAINT FK_StudentAwards_Awards FOREIGN KEY (AwardId) REFERENCES Awards(Id),
    CONSTRAINT FK_StudentAwards_Admin FOREIGN KEY (AwardedBy) REFERENCES Users(Id)
);

-- =============================================
-- 5. TRIỂN LÃM & BÁN HÀNG
-- =============================================
CREATE TABLE Exhibitions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Location NVARCHAR(200),
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(50) DEFAULT 'Planned'
);

CREATE TABLE ExhibitionSubmissions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ExhibitionId INT NOT NULL,
    SubmissionId INT NOT NULL,
    ProposedPrice DECIMAL(18,2) NOT NULL CHECK (ProposedPrice >= 0),
    Status NVARCHAR(50) DEFAULT 'Available',

    CONSTRAINT FK_ExhSub_Exhibitions FOREIGN KEY (ExhibitionId) REFERENCES Exhibitions(Id),
    CONSTRAINT FK_ExhSub_Submissions FOREIGN KEY (SubmissionId) REFERENCES Submissions(Id)
);

CREATE TABLE Sales (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ExhibitionSubmissionId INT NOT NULL,
    CustomerId INT NOT NULL, -- giữ bảng Customers
    SoldPrice DECIMAL(18,2) NOT NULL CHECK (SoldPrice >= 0),
    SoldDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Sales_ExhSub FOREIGN KEY (ExhibitionSubmissionId) REFERENCES ExhibitionSubmissions(Id),
    CONSTRAINT FK_Sales_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);

-- =============================================
-- VIEW: TỔNG ĐIỂM (0..100) THEO TRỌNG SỐ (%)
-- =============================================
GO
CREATE OR ALTER VIEW vw_SubmissionTotalScore
AS
SELECT 
    sr.SubmissionId,
    SUM(gd.RawScore * cc.WeightPercent / 100.0) AS TotalScore_0_100
FROM SubmissionReviews sr
JOIN GradeDetails gd 
    ON gd.ReviewId = sr.Id
JOIN Submissions s
    ON s.Id = sr.SubmissionId
JOIN CompetitionCriteria cc
    ON cc.CompetitionId = s.CompetitionId
   AND cc.CriteriaId = gd.CriteriaId
GROUP BY sr.SubmissionId;
GO

-- =============================================
-- 6. THÔNG BÁO (NOTIFICATIONS)
-- =============================================

/*
  NotificationType values (match frontend):
    'award'       – student won an award
    'submission'  – new submission received / submission evaluated
    'competition' – competition status change / deadline reminder
    'exhibition'  – artwork added to / removed from exhibition
    'purchase'    – artwork sold
    'announcement'– general broadcast from admin/manager
*/

CREATE TABLE Notifications (
    Id          INT PRIMARY KEY IDENTITY(1,1),
    UserId      INT NOT NULL,                          -- recipient
    Type        VARCHAR(20) NOT NULL
                    CONSTRAINT CK_Notif_Type CHECK (Type IN (
                        'award','submission','competition',
                        'exhibition','purchase','announcement')),
    Title       NVARCHAR(200) NOT NULL,
    Message     NVARCHAR(MAX) NOT NULL,
    IsRead      BIT NOT NULL DEFAULT 0,
    Link        NVARCHAR(500) NULL,                    -- frontend route, e.g. /dashboard/my-awards
    -- optional FK metadata (all nullable)
    CompetitionId       INT NULL,
    SubmissionId        INT NULL,
    AwardId             INT NULL,
    ExhibitionId        INT NULL,
    CreatedAt   DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),

    CONSTRAINT FK_Notif_Users        FOREIGN KEY (UserId)        REFERENCES Users(Id),
    CONSTRAINT FK_Notif_Competition  FOREIGN KEY (CompetitionId) REFERENCES Competitions(Id),
    CONSTRAINT FK_Notif_Submission   FOREIGN KEY (SubmissionId)  REFERENCES Submissions(Id),
    CONSTRAINT FK_Notif_Award        FOREIGN KEY (AwardId)       REFERENCES Awards(Id),
    CONSTRAINT FK_Notif_Exhibition   FOREIGN KEY (ExhibitionId)  REFERENCES Exhibitions(Id)
);
GO

-- Index for fast per-user queries (unread first)
CREATE INDEX IX_Notifications_UserId_IsRead
    ON Notifications (UserId, IsRead, CreatedAt DESC);
GO

-- =============================================
-- TRIGGER: Auto-notify student when submission is reviewed
-- =============================================
CREATE OR ALTER TRIGGER TRG_Notif_SubmissionReviewed
ON SubmissionReviews
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Notify the student whose submission was reviewed
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, CompetitionId)
    SELECT
        s.StudentId,
        'submission',
        N'Submission Evaluated',
        N'Your submission "' + ISNULL(s.Title, N'Untitled') + N'" has been rated as "' + i.RatingLevel + N'".',
        N'/dashboard/my-submissions',
        s.Id,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s ON s.Id = i.SubmissionId;

    -- Also notify all managers about the new review
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, CompetitionId)
    SELECT
        u.Id,
        'submission',
        N'Submission Reviewed',
        N'Staff reviewed "' + ISNULL(s.Title, N'Untitled') + N'" — rated ' + i.RatingLevel + N'.',
        N'/dashboard/submissions',
        s.Id,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s ON s.Id = i.SubmissionId
    CROSS JOIN (SELECT Id FROM Users WHERE RoleId = (SELECT Id FROM Roles WHERE RoleName = 'Manager')) u;
END;
GO

-- =============================================
-- TRIGGER: Auto-notify student when award is granted
-- =============================================
CREATE OR ALTER TRIGGER TRG_Notif_AwardGranted
ON StudentAwards
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, AwardId, CompetitionId)
    SELECT
        s.StudentId,
        'award',
        N'Congratulations! Award Won',
        N'You won "' + a.AwardName + N'" for your submission "' + ISNULL(s.Title, N'Untitled') + N'".',
        N'/dashboard/my-awards',
        s.Id,
        i.AwardId,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s ON s.Id = i.SubmissionId
    JOIN Awards a      ON a.Id = i.AwardId;
END;
GO

-- =============================================
-- TRIGGER: Auto-notify student when artwork added to exhibition
-- =============================================
CREATE OR ALTER TRIGGER TRG_Notif_ExhibitionAdded
ON ExhibitionSubmissions
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        s.StudentId,
        'exhibition',
        N'Artwork Selected for Exhibition',
        N'Your artwork "' + ISNULL(s.Title, N'Untitled') + N'" has been selected for the exhibition "' + e.Title + N'".',
        N'/dashboard/my-submissions',
        s.Id,
        i.ExhibitionId
    FROM inserted i
    JOIN Submissions s  ON s.Id = i.SubmissionId
    JOIN Exhibitions e  ON e.Id = i.ExhibitionId;
END;
GO

-- =============================================
-- TRIGGER: Auto-notify student when artwork is sold
-- =============================================
CREATE OR ALTER TRIGGER TRG_Notif_ArtworkSold
ON Sales
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        s.StudentId,
        'purchase',
        N'Your Artwork Was Sold',
        N'"' + ISNULL(s.Title, N'Untitled') + N'" was sold for ' +
            FORMAT(i.SoldPrice, 'N0') + N' VND.',
        N'/dashboard/my-submissions',
        s.Id,
        es.ExhibitionId
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId;

    -- Also notify managers
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId)
    SELECT
        u.Id,
        'purchase',
        N'Artwork Sold',
        N'"' + ISNULL(s.Title, N'Untitled') + N'" sold for ' + FORMAT(i.SoldPrice, 'N0') + N' VND.',
        N'/dashboard/exhibitions',
        s.Id
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId
    CROSS JOIN (SELECT Id FROM Users WHERE RoleId = (SELECT Id FROM Roles WHERE RoleName = 'Manager')) u;
END;
GO

-- =============================================
-- TRIGGER: Auto-notify students when competition status changes
-- =============================================
CREATE OR ALTER TRIGGER TRG_Notif_CompetitionStatus
ON Competitions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Only fire when Status actually changed
    IF NOT UPDATE(Status) RETURN;

    -- Notify all students who submitted to this competition
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, CompetitionId)
    SELECT DISTINCT
        s.StudentId,
        'competition',
        CASE i.Status
            WHEN 'Ongoing'   THEN N'Competition Started'
            WHEN 'Completed' THEN N'Competition Ended'
            ELSE N'Competition Status Updated'
        END,
        N'Competition "' + i.Title + N'" is now ' + i.Status + N'.',
        N'/dashboard/view-competitions',
        i.Id
    FROM inserted i
    JOIN deleted  d ON d.Id = i.Id AND d.Status <> i.Status
    JOIN Submissions s ON s.CompetitionId = i.Id;
END;
GO

-- =============================================
-- STORED PROCEDURE: Broadcast announcement to all users (or by role)
-- =============================================
CREATE OR ALTER PROCEDURE sp_BroadcastAnnouncement
    @Title      NVARCHAR(200),
    @Message    NVARCHAR(MAX),
    @Link       NVARCHAR(500) = NULL,
    @RoleName   NVARCHAR(50)  = NULL   -- NULL = all users
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (UserId, Type, Title, Message, Link)
    SELECT u.Id, 'announcement', @Title, @Message, @Link
    FROM Users u
    JOIN Roles r ON r.Id = u.RoleId
    WHERE u.IsActive = 1
      AND (@RoleName IS NULL OR r.RoleName = @RoleName);
END;
GO

-- =============================================
-- STORED PROCEDURE: Mark notification(s) as read
-- =============================================
CREATE OR ALTER PROCEDURE sp_MarkNotificationsRead
    @UserId INT,
    @NotificationId INT = NULL   -- NULL = mark ALL for this user
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Notifications
    SET IsRead = 1
    WHERE UserId = @UserId
      AND (@NotificationId IS NULL OR Id = @NotificationId)
      AND IsRead = 0;
END;
GO

-- =============================================
-- VIEW: Unread notification count per user
-- =============================================
CREATE OR ALTER VIEW vw_UnreadNotificationCount
AS
SELECT UserId, COUNT(*) AS UnreadCount
FROM Notifications
WHERE IsRead = 0
GROUP BY UserId;
GO

-- =============================================
-- DỮ LIỆU MẶC ĐỊNH
-- =============================================
INSERT INTO Roles (RoleName)
VALUES ('Admin'), ('Manager'), ('Staff'), ('Student'), ('Customer');

INSERT INTO Criteria (CriteriaCode, CriteriaName)
VALUES
('CREATIVITY',  N'Sáng tạo'),
('COMPLETION',  N'Hoàn thiện'),
('SKILLS',      N'Kỹ năng'),
('COMPOSITION', N'Bố cục');
GO
