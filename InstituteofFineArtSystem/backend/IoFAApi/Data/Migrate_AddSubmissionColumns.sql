-- Migration: Add missing columns to Submissions table
-- Run against: FineArtsInstitute_Final
USE FineArtsInstitute_Final;
GO

ALTER TABLE Submissions
    ADD FileName    NVARCHAR(500) NULL,
        Description NVARCHAR(MAX) NULL,
        Quotation   NVARCHAR(MAX) NULL,
        Poem        NVARCHAR(MAX) NULL;
GO
