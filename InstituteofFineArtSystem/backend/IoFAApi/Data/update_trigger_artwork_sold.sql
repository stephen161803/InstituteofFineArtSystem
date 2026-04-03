USE [FineArtsInstitute_Final]
GO

-- Drop and recreate trigger with USD + customer notification
ALTER TRIGGER [dbo].[TRG_Notif_ArtworkSold]
ON [dbo].[Sales]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Notify student (artwork owner)
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        s.StudentId,
        'purchase',
        N'Your Artwork Was Sold',
        N'"' + ISNULL(s.Title, N'Untitled') + N'" was sold for $' +
            FORMAT(i.SoldPrice, 'N0') + N'.',
        N'/dashboard/my-submissions',
        s.Id,
        es.ExhibitionId
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId;

    -- 2. Notify customer (buyer)
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        c.UserId,
        'purchase',
        N'Purchase Confirmed',
        N'You have successfully purchased "' + ISNULL(s.Title, N'Untitled') + N'" for $' +
            FORMAT(i.SoldPrice, 'N0') + N'.',
        N'/dashboard',
        s.Id,
        es.ExhibitionId
    FROM inserted i
    JOIN ExhibitionSubmissions es ON es.Id = i.ExhibitionSubmissionId
    JOIN Submissions s            ON s.Id  = es.SubmissionId
    JOIN Customers c              ON c.Id  = i.CustomerId;

    -- 3. Notify all managers
    INSERT INTO Notifications (UserId, Type, Title, Message, Link, SubmissionId, ExhibitionId)
    SELECT
        u.Id,
        'purchase',
        N'Artwork Sold',
        N'"' + ISNULL(s.Title, N'Untitled') + N'" sold for $' +
            FORMAT(i.SoldPrice, 'N0') + N'.',
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
