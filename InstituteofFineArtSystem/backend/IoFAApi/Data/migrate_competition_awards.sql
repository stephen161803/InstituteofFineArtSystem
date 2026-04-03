USE [FineArtsInstitute_Final]
GO

-- 1. Create CompetitionAwards table (Id, CompetitionId, AwardId)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CompetitionAwards')
CREATE TABLE [dbo].[CompetitionAwards] (
    [Id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [CompetitionId] INT NOT NULL,
    [AwardId]       INT NOT NULL,
    CONSTRAINT [FK_CompetitionAwards_Competitions]
        FOREIGN KEY ([CompetitionId]) REFERENCES [dbo].[Competitions]([Id]),
    CONSTRAINT [FK_CompetitionAwards_Awards]
        FOREIGN KEY ([AwardId]) REFERENCES [dbo].[Awards]([Id])
)
GO

-- 2. Add CompetitionAwardId to StudentAwards (nullable first)
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID('StudentAwards') AND name = 'CompetitionAwardId'
)
ALTER TABLE [dbo].[StudentAwards] ADD [CompetitionAwardId] INT NULL
GO

-- 3. Make AwardId nullable (legacy column)
ALTER TABLE [dbo].[StudentAwards]
ALTER COLUMN [AwardId] INT NULL
GO

-- 4. Add FK for CompetitionAwardId
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentAwards_CompetitionAwards')
ALTER TABLE [dbo].[StudentAwards]
ADD CONSTRAINT [FK_StudentAwards_CompetitionAwards]
    FOREIGN KEY ([CompetitionAwardId]) REFERENCES [dbo].[CompetitionAwards]([Id])
GO

PRINT 'Migration completed.'
GO
