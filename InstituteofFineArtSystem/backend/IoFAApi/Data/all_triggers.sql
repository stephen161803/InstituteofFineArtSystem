USE [FineArtsInstitute_Final]
GO

-- ============================================================
-- DROP ALL TRIGGERS FIRST (safe re-run)
-- ============================================================
IF OBJECT_ID('dbo.TRG_CompetitionCriteria_WeightSum_100', 'TR') IS NOT NULL
    DROP TRIGGER [dbo].[TRG_CompetitionCriteria_WeightSum_100]
GO
IF OBJECT_ID('dbo.TRG_Notif_CompetitionStatus', 'TR') IS NOT NULL
    DROP TRIGGER [dbo].[TRG_Notif_CompetitionStatus]
GO
IF OBJECT_ID('dbo.TRG_Notif_ExhibitionAdded', 'TR') IS NOT NULL
    DROP TRIGGER [dbo].[TRG_Notif_ExhibitionAdded]
GO
IF OBJECT_ID('dbo.TRG_Notif_ArtworkSold', 'TR') IS NOT NULL
    DROP TRIGGER [dbo].[TRG_Notif_ArtworkSold]
GO
IF OBJECT_ID('dbo.TRG_Notif_AwardGranted', 'TR') IS NOT NULL
    DROP TRIGGER [dbo].[TRG_Notif_AwardGranted]
GO
IF OBJECT_ID('dbo.TRG_Notif_SubmissionReviewed', 'TR') IS NOT NULL
    DROP TRIGGER [dbo].[TRG_Notif_SubmissionReviewed]
GO

-- ============================================================
-- 1. TRG_CompetitionCriteria_WeightSum_100
--    Validates total weight per competition must equal 100%
-- ============================================================
CREATE TRIGGER [dbo].[TRG_CompetitionCriteria_WeightSum_100]
ON [dbo].[CompetitionCriteria]
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
    WHERE x.TotalWeight > 0.01
      AND ABS(x.TotalWeight - 100.0) > 0.01
      AND x.TotalWeight > 100.01;

    IF @Bad > 0
    BEGIN
        RAISERROR (N'Total WeightPercent for each competition must equal 100', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
ALTER TABLE [dbo].[CompetitionCriteria] ENABLE TRIGGER [TRG_CompetitionCriteria_WeightSum_100]
GO

-- ============================================================
-- 2. TRG_Notif_CompetitionStatus
--    Notifies students when competition status changes
-- ============================================================
CREATE TRIGGER [dbo].[TRG_Notif_CompetitionStatus]
ON [dbo].[Competitions]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT UPDATE(Status) RETURN;

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
ALTER TABLE [dbo].[Competitions] ENABLE TRIGGER [TRG_Notif_CompetitionStatus]
GO

-- ============================================================
-- 3. TRG_Notif_ExhibitionAdded
--    Notifies student when artwork is added to an exhibition
-- ============================================================
CREATE TRIGGER [dbo].[TRG_Notif_ExhibitionAdded]
ON [dbo].[ExhibitionSubmissions]
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
    JOIN Submissions s ON s.Id = i.SubmissionId
    JOIN Exhibitions e ON e.Id = i.ExhibitionId;
END;
GO
ALTER TABLE [dbo].[ExhibitionSubmissions] ENABLE TRIGGER [TRG_Notif_ExhibitionAdded]
GO

-- ============================================================
-- 4. TRG_Notif_ArtworkSold
--    Notifies student (owner), customer (buyer), and managers
-- ============================================================
CREATE TRIGGER [dbo].[TRG_Notif_ArtworkSold]
ON [dbo].[Sales]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Notify student (artwork owner)
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        s.StudentId,
        'purchase',
        N'Your Artwork Was Sold',
        N'"' + ISNULL(s.Title, N'Untitled') + N'" was sold for $' + FORMAT(i.SoldPrice, 'N0') + N'.',
        N'/dashboard/my-submissions',
        s.Id,
        es.ExhibitionId
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId;

    -- Notify customer (buyer)
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        c.UserId,
        'purchase',
        N'Purchase Confirmed',
        N'You have successfully purchased "' + ISNULL(s.Title, N'Untitled') + N'" for $' + FORMAT(i.SoldPrice, 'N0') + N'.',
        N'/dashboard',
        s.Id,
        es.ExhibitionId
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId
    JOIN Customers c              ON c.Id  = i.CustomerId;

    -- Notify all active managers
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        u.Id,
        'purchase',
        N'Artwork Sold',
        N'"' + ISNULL(s.Title, N'Untitled') + N'" sold for $' + FORMAT(i.SoldPrice, 'N0') + N'.',
        N'/dashboard/exhibitions',
        s.Id,
        es.ExhibitionId
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId
    CROSS JOIN (
        SELECT Id FROM Users
        WHERE RoleId = (SELECT Id FROM Roles WHERE RoleName = 'Manager')
        AND IsActive = 1
    ) u;
END;
GO
ALTER TABLE [dbo].[Sales] ENABLE TRIGGER [TRG_Notif_ArtworkSold]
GO

-- ============================================================
-- 5. TRG_Notif_AwardGranted
--    Notifies student when award is granted
--    Uses CompetitionAwardId (new schema)
-- ============================================================
CREATE TRIGGER [dbo].[TRG_Notif_AwardGranted]
ON [dbo].[StudentAwards]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, CompetitionId)
    SELECT
        s.StudentId,
        'award',
        N'Congratulations! Award Won',
        N'You won "' + ca.AwardName + N'" for your submission "' + ISNULL(s.Title, N'Untitled') + N'".',
        N'/dashboard/my-awards',
        s.Id,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s       ON s.Id  = i.SubmissionId
    JOIN CompetitionAwards ca ON ca.Id = i.CompetitionAwardId;
END;
GO
ALTER TABLE [dbo].[StudentAwards] ENABLE TRIGGER [TRG_Notif_AwardGranted]
GO

-- ============================================================
-- 6. TRG_Notif_SubmissionReviewed
--    Notifies student and managers when submission is reviewed
-- ============================================================
CREATE TRIGGER [dbo].[TRG_Notif_SubmissionReviewed]
ON [dbo].[SubmissionReviews]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Notify student
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

    -- Notify all active managers
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, CompetitionId)
    SELECT
        u.Id,
        'submission',
        N'Submission Reviewed',
        N'Staff reviewed "' + ISNULL(s.Title, N'Untitled') + N'" - rated ' + i.RatingLevel + N'.',
        N'/dashboard/submissions',
        s.Id,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s ON s.Id = i.SubmissionId
    CROSS JOIN (
        SELECT Id FROM Users
        WHERE RoleId = (SELECT Id FROM Roles WHERE RoleName = 'Manager')
        AND IsActive = 1
    ) u;
END;
GO
ALTER TABLE [dbo].[SubmissionReviews] ENABLE TRIGGER [TRG_Notif_SubmissionReviewed]
GO

PRINT 'All 6 triggers created successfully.'
GO
