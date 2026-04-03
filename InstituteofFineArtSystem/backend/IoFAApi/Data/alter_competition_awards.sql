USE [FineArtsInstitute_Final]
GO

-- 1. Add AwardId column to CompetitionAwards
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID('CompetitionAwards') AND name = 'AwardId'
)
ALTER TABLE [dbo].[CompetitionAwards] ADD [AwardId] INT NULL
GO

-- 2. Migrate data: match AwardName to Awards table
UPDATE ca
SET ca.AwardId = a.Id
FROM [dbo].[CompetitionAwards] ca
JOIN [dbo].[Awards] a ON a.AwardName = ca.AwardName
WHERE ca.AwardId IS NULL
GO

-- 3. For any unmatched rows, insert into Awards first then link
INSERT INTO [dbo].[Awards] ([AwardName], [Description])
SELECT DISTINCT ca.AwardName, ca.Description
FROM [dbo].[CompetitionAwards] ca
WHERE ca.AwardId IS NULL
  AND NOT EXISTS (SELECT 1 FROM [dbo].[Awards] a WHERE a.AwardName = ca.AwardName)
GO

UPDATE ca
SET ca.AwardId = a.Id
FROM [dbo].[CompetitionAwards] ca
JOIN [dbo].[Awards] a ON a.AwardName = ca.AwardName
WHERE ca.AwardId IS NULL
GO

-- 4. Make AwardId NOT NULL
ALTER TABLE [dbo].[CompetitionAwards]
ALTER COLUMN [AwardId] INT NOT NULL
GO

-- 5. Add FK constraint
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CompetitionAwards_Awards')
ALTER TABLE [dbo].[CompetitionAwards]
ADD CONSTRAINT [FK_CompetitionAwards_Awards]
    FOREIGN KEY ([AwardId]) REFERENCES [dbo].[Awards]([Id])
GO

-- 6. Drop AwardName and Description columns (no longer needed)
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('CompetitionAwards') AND name = 'AwardName')
ALTER TABLE [dbo].[CompetitionAwards] DROP COLUMN [AwardName]
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('CompetitionAwards') AND name = 'Description')
ALTER TABLE [dbo].[CompetitionAwards] DROP COLUMN [Description]
GO

PRINT 'CompetitionAwards refactored: AwardName/Description removed, AwardId added.'
GO
