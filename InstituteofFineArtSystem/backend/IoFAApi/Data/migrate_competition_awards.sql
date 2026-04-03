USE [FineArtsInstitute_Final]
GO

-- 1. Create CompetitionAwards table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CompetitionAwards')
CREATE TABLE [dbo].[CompetitionAwards] (
    [Id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [CompetitionId] INT NOT NULL,
    [AwardName]     NVARCHAR(100) NOT NULL,
    [Description]   NVARCHAR(500) NULL,
    CONSTRAINT [FK_CompetitionAwards_Competitions]
        FOREIGN KEY ([CompetitionId]) REFERENCES [dbo].[Competitions]([Id])
)
GO

-- 2. Add CompetitionAwardId column to StudentAwards (nullable first)
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID('StudentAwards') AND name = 'CompetitionAwardId'
)
ALTER TABLE [dbo].[StudentAwards] ADD [CompetitionAwardId] INT NULL
GO

-- 3. Migrate existing StudentAwards data:
--    For each existing award, create a CompetitionAward entry and link it
INSERT INTO [dbo].[CompetitionAwards] ([CompetitionId], [AwardName], [Description])
SELECT DISTINCT
    s.CompetitionId,
    a.AwardName,
    a.Description
FROM [dbo].[StudentAwards] sa
JOIN [dbo].[Awards] a ON sa.AwardId = a.Id
JOIN [dbo].[Submissions] s ON sa.SubmissionId = s.Id
GO

-- 4. Update CompetitionAwardId based on matching AwardName + CompetitionId
UPDATE sa
SET sa.CompetitionAwardId = ca.Id
FROM [dbo].[StudentAwards] sa
JOIN [dbo].[Submissions] sub ON sa.SubmissionId = sub.Id
JOIN [dbo].[Awards] a ON sa.AwardId = a.Id
JOIN [dbo].[CompetitionAwards] ca
    ON ca.CompetitionId = sub.CompetitionId AND ca.AwardName = a.AwardName
GO

-- 5. Make CompetitionAwardId NOT NULL after migration
ALTER TABLE [dbo].[StudentAwards]
ALTER COLUMN [CompetitionAwardId] INT NOT NULL
GO

-- 6. Add FK constraint
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentAwards_CompetitionAwards')
ALTER TABLE [dbo].[StudentAwards]
ADD CONSTRAINT [FK_StudentAwards_CompetitionAwards]
    FOREIGN KEY ([CompetitionAwardId]) REFERENCES [dbo].[CompetitionAwards]([Id])
GO

-- 7. Drop old AwardId FK and column (optional, keep for safety)
-- ALTER TABLE [dbo].[StudentAwards] DROP CONSTRAINT [FK_StudentAwards_Awards]
-- ALTER TABLE [dbo].[StudentAwards] DROP COLUMN [AwardId]
