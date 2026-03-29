USE [master]
GO
/****** Object:  Database [FineArtsInstitute_Final]    Script Date: 23/03/2026 1:29:14 CH ******/
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'FineArtsInstitute_Final')
BEGIN
    CREATE DATABASE [FineArtsInstitute_Final]
END
GO
ALTER DATABASE [FineArtsInstitute_Final] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FineArtsInstitute_Final].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FineArtsInstitute_Final] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET ARITHABORT OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET  ENABLE_BROKER 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET RECOVERY FULL 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET  MULTI_USER 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FineArtsInstitute_Final] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [FineArtsInstitute_Final] SET QUERY_STORE = ON
GO
ALTER DATABASE [FineArtsInstitute_Final] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200)
GO
USE [FineArtsInstitute_Final]
GO
/****** Object:  Table [dbo].[CompetitionCriteria]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompetitionCriteria](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompetitionId] [int] NOT NULL,
	[CriteriaId] [int] NOT NULL,
	[WeightPercent] [decimal](6, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Submissions]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Submissions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompetitionId] [int] NOT NULL,
	[StudentId] [int] NOT NULL,
	[Title] [nvarchar](200) NULL,
	[WorkUrl] [nvarchar](Max) NULL,
	[ProposedPrice] [decimal](18, 2) NULL,
	[SubmittedAt] [datetimeoffset](7) NULL,
	[FileName] [nvarchar](500) NULL,
	[Description] [nvarchar](max) NULL,
	[Quotation] [nvarchar](max) NULL,
	[Poem] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SubmissionReviews]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SubmissionReviews](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SubmissionId] [int] NOT NULL,
	[StaffId] [int] NOT NULL,
	[RatingLevel] [nvarchar](20) NOT NULL,
	[Strengths] [nvarchar](max) NULL,
	[Weaknesses] [nvarchar](max) NULL,
	[Improvements] [nvarchar](max) NULL,
	[ReviewedAt] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GradeDetails]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GradeDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ReviewId] [int] NOT NULL,
	[CriteriaId] [int] NOT NULL,
	[RawScore] [decimal](5, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_SubmissionTotalScore]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
CREATE   VIEW [dbo].[vw_SubmissionTotalScore]
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
/****** Object:  Table [dbo].[RefreshTokens] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RefreshTokens')
CREATE TABLE [dbo].[RefreshTokens](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Token] [nvarchar](500) NOT NULL,
	[ExpiresAt] [datetimeoffset](7) NOT NULL,
	[IsRevoked] [bit] NOT NULL DEFAULT 0,
	[CreatedAt] [datetimeoffset](7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notifications]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notifications](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Type] [varchar](20) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[IsRead] [bit] NOT NULL,
	[Link] [nvarchar](500) NULL,
	[CompetitionId] [int] NULL,
	[SubmissionId] [int] NULL,
	[AwardId] [int] NULL,
	[ExhibitionId] [int] NULL,
	[CreatedAt] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_UnreadNotificationCount]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- VIEW: Unread notification count per user
-- =============================================
CREATE   VIEW [dbo].[vw_UnreadNotificationCount]
AS
SELECT UserId, COUNT(*) AS UnreadCount
FROM Notifications
WHERE IsRead = 0
GROUP BY UserId;

GO
/****** Object:  Table [dbo].[Awards]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Awards](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AwardName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Competitions]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Competitions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NOT NULL,
	[CreatedBy] [int] NULL,
	[Status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Criteria]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Criteria](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CriteriaCode] [varchar](50) NOT NULL,
	[CriteriaName] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Address] [nvarchar](255) NULL,
	[Notes] [nvarchar](max) NULL,
	[CreatedAt] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Exhibitions]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Exhibitions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Location] [nvarchar](200) NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
	[Status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExhibitionSubmissions]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExhibitionSubmissions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ExhibitionId] [int] NOT NULL,
	[SubmissionId] [int] NOT NULL,
	[ProposedPrice] [decimal](18, 2) NOT NULL,
	[Status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sales]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sales](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ExhibitionSubmissionId] [int] NOT NULL,
	[CustomerId] [int] NOT NULL,
	[SoldPrice] [decimal](18, 2) NOT NULL,
	[SoldDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Staffs]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Staffs](
	[UserId] [int] NOT NULL,
	[DateJoined] [date] NULL,
	[SubjectHandled] [nvarchar](100) NULL,
	[Remarks] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentAwards]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentAwards](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SubmissionId] [int] NOT NULL,
	[AwardId] [int] NOT NULL,
	[AwardedBy] [int] NOT NULL,
	[AwardedDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Students]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Students](
	[UserId] [int] NOT NULL,
	[AdmissionNumber] [varchar](20) NOT NULL,
	[AdmissionDate] [date] NULL,
	[DateOfBirth] [date] NULL,
	[Address] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[PasswordHash] [varchar](255) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [varchar](100) NULL,
	[Phone] [varchar](15) NULL,
	[IsActive] [bit] NULL,
	[RoleId] [int] NOT NULL,
	[CreatedAt] [datetimeoffset](7) NULL,
	[AvatarUrl] [nvarchar](Max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Awards] ON 

INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (1, N'First Prize', N'Awarded to the best submission in the competition')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (2, N'Second Prize', N'Awarded to the second-best submission in the competition')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (3, N'Third Prize', N'Awarded to the third-best submission in the competition')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (4, N'Honorable Mention', N'Special recognition for outstanding creativity')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (5, N'Best Use of Color', N'Awarded for exceptional use of color in artwork')
SET IDENTITY_INSERT [dbo].[Awards] OFF
GO
SET IDENTITY_INSERT [dbo].[CompetitionCriteria] ON 

INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1, 1, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (2, 1, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (3, 1, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (4, 1, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (5, 2, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (6, 2, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (7, 2, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (8, 2, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (9, 3, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (10, 3, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (11, 3, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (12, 3, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (13, 4, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (14, 4, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (15, 4, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (16, 4, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (17, 5, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (18, 5, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (19, 5, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (20, 5, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (21, 6, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (22, 6, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (23, 6, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (24, 6, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (25, 7, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (26, 7, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (27, 7, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (28, 7, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (29, 8, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (30, 8, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (31, 8, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (32, 8, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (33, 9, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (34, 9, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (35, 9, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (36, 9, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (37, 10, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (38, 10, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (39, 10, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (40, 10, 4, CAST(25.00 AS Decimal(6, 2)))
SET IDENTITY_INSERT [dbo].[CompetitionCriteria] OFF
GO
SET IDENTITY_INSERT [dbo].[Competitions] ON 

INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (1, N'Spring Art Competition 2025', N'Annual spring competition celebrating creativity and artistic expression', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-05-31T00:00:00.000' AS DateTime), 1, N'Completed')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (2, N'Digital Art Showcase 2025', N'Explore the intersection of technology and traditional art forms', CAST(N'2025-06-01T00:00:00.000' AS DateTime), CAST(N'2025-08-31T00:00:00.000' AS DateTime), 1, N'Completed')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (3, N'Abstract Expressions 2025', N'A competition focused on abstract and experimental art techniques', CAST(N'2025-09-01T00:00:00.000' AS DateTime), CAST(N'2025-11-30T00:00:00.000' AS DateTime), 1, N'Ongoing')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (4, N'Winter Wonderland Art 2025', N'Capture the magic of winter through your artistic vision', CAST(N'2025-12-01T00:00:00.000' AS DateTime), CAST(N'2026-02-28T00:00:00.000' AS DateTime), 1, N'Upcoming')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (5, N'Spring Art Festival 2026', N'Celebrate spring with vibrant paintings', CAST(N'2026-03-01T00:00:00.000' AS DateTime), CAST(N'2026-03-31T00:00:00.000' AS DateTime), 3, N'Ongoing')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (6, N'Abstract Expression Contest', N'Explore abstract art techniques. Any medium accepted', CAST(N'2026-04-01T00:00:00.000' AS DateTime), CAST(N'2026-04-30T00:00:00.000' AS DateTime), 9, N'Upcoming')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (7, N'Winter Wonderland 2025', N'Winter themed artwork competition', CAST(N'2025-12-01T00:00:00.000' AS DateTime), CAST(N'2026-01-15T00:00:00.000' AS DateTime), 3, N'Completed')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (8, N'Summer Creativity Challenge 2025', N'Showcase your creativity with summer-inspired artwork', CAST(N'2025-06-01T00:00:00.000' AS DateTime), CAST(N'2025-08-31T00:00:00.000' AS DateTime), 10, N'Completed')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (9, N'Nature Photography Challenge', N'Capture the beauty of nature through your lens. Max 3 submissions/student', CAST(N'2026-03-15T00:00:00.000' AS DateTime), CAST(N'2026-04-15T00:00:00.000' AS DateTime), 9, N'Ongoing')
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status]) VALUES (10, N'Digital Art Revolution 2026', N'Push the boundaries of digital art and animation', CAST(N'2026-05-01T00:00:00.000' AS DateTime), CAST(N'2026-06-30T00:00:00.000' AS DateTime), 10, N'Upcoming')
SET IDENTITY_INSERT [dbo].[Competitions] OFF
GO
SET IDENTITY_INSERT [dbo].[Criteria] ON 

INSERT [dbo].[Criteria] ([Id], [CriteriaCode], [CriteriaName], [IsActive]) VALUES (1, N'CREATIVITY', N'CREATIVITY', 1)
INSERT [dbo].[Criteria] ([Id], [CriteriaCode], [CriteriaName], [IsActive]) VALUES (2, N'COMPLETION', N'COMPLETION', 1)
INSERT [dbo].[Criteria] ([Id], [CriteriaCode], [CriteriaName], [IsActive]) VALUES (3, N'SKILLS', N'SKILLS', 1)
INSERT [dbo].[Criteria] ([Id], [CriteriaCode], [CriteriaName], [IsActive]) VALUES (4, N'COMPOSITION', N'COMPOSITION', 1)
SET IDENTITY_INSERT [dbo].[Criteria] OFF
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 

INSERT [dbo].[Customers] ([Id], [UserId], [Address], [Notes], [CreatedAt]) VALUES (1, 7, NULL, NULL, CAST(N'2026-03-22T22:57:13.8836476+07:00' AS DateTimeOffset))
INSERT [dbo].[Customers] ([Id], [UserId], [Address], [Notes], [CreatedAt]) VALUES (2, 8, NULL, NULL, CAST(N'2026-03-22T22:57:13.8836476+07:00' AS DateTimeOffset))
INSERT [dbo].[Customers] ([Id], [UserId], [Address], [Notes], [CreatedAt]) VALUES (3, 14, N'123 Oak Street, New York', N'Prefers careful packaging', CAST(N'2026-03-23T11:40:26.5930153+07:00' AS DateTimeOffset))
INSERT [dbo].[Customers] ([Id], [UserId], [Address], [Notes], [CreatedAt]) VALUES (4, 15, N'456 Maple Avenue, Los Angeles', N'Collector, loves dynamic compositions', CAST(N'2026-03-23T11:40:26.5930153+07:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[Customers] OFF
GO
SET IDENTITY_INSERT [dbo].[Exhibitions] ON 

INSERT [dbo].[Exhibitions] ([Id], [Title], [Location], [StartDate], [EndDate], [Status]) VALUES (1, N'Spring Gallery 2025', N'Main Hall, IFA Campus', CAST(N'2025-07-01' AS Date), CAST(N'2025-07-31' AS Date), N'Completed')
INSERT [dbo].[Exhibitions] ([Id], [Title], [Location], [StartDate], [EndDate], [Status]) VALUES (2, N'Digital Art Exhibition 2025', N'Gallery B, IFA Campus', CAST(N'2025-10-01' AS Date), CAST(N'2025-10-31' AS Date), N'Completed')
INSERT [dbo].[Exhibitions] ([Id], [Title], [Location], [StartDate], [EndDate], [Status]) VALUES (3, N'Contemporary Digital Art 2026', N'Museum of Modern Art, New York', CAST(N'2026-03-01' AS Date), CAST(N'2026-04-30' AS Date), N'Ongoing')
INSERT [dbo].[Exhibitions] ([Id], [Title], [Location], [StartDate], [EndDate], [Status]) VALUES (4, N'Spring Watercolor Festival', N'Art Gallery Downtown, Los Angeles', CAST(N'2026-02-15' AS Date), CAST(N'2026-04-15' AS Date), N'Ongoing')
INSERT [dbo].[Exhibitions] ([Id], [Title], [Location], [StartDate], [EndDate], [Status]) VALUES (5, N'Nature Photography Showcase', N'Chicago Photography Center, Illinois', CAST(N'2026-05-01' AS Date), CAST(N'2026-06-15' AS Date), N'Upcoming')
SET IDENTITY_INSERT [dbo].[Exhibitions] OFF
GO
SET IDENTITY_INSERT [dbo].[ExhibitionSubmissions] ON 

INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (1, 1, 1, CAST(2000000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (2, 1, 2, CAST(1500000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (3, 2, 3, CAST(2500000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (4, 2, 4, CAST(1800000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (5, 3, 7, CAST(2500000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (6, 3, 8, CAST(1800000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (7, 3, 11, CAST(1600000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (8, 4, 12, CAST(3000000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (9, 4, 9, CAST(2100000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (10, 5, 27, CAST(2800000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (11, 5, 28, CAST(1900000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (12, 5, 29, CAST(2200000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (13, 5, 30, CAST(2900000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (14, 5, 31, CAST(3300000.00 AS Decimal(18, 2)), N'Available')
SET IDENTITY_INSERT [dbo].[ExhibitionSubmissions] OFF
GO
SET IDENTITY_INSERT [dbo].[GradeDetails] ON 

INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (1, 1, 1, CAST(95.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (2, 1, 2, CAST(90.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (3, 1, 3, CAST(88.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (4, 1, 4, CAST(92.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (5, 2, 1, CAST(82.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (6, 2, 2, CAST(88.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (7, 2, 3, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (8, 2, 4, CAST(90.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (9, 3, 1, CAST(96.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (10, 3, 2, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (11, 3, 3, CAST(92.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (12, 3, 4, CAST(88.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (13, 4, 1, CAST(78.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (14, 4, 2, CAST(82.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (15, 4, 3, CAST(75.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (16, 4, 4, CAST(70.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (17, 5, 1, CAST(96.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (18, 5, 2, CAST(94.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (19, 5, 3, CAST(95.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (20, 5, 4, CAST(97.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (21, 6, 1, CAST(84.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (22, 6, 2, CAST(86.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (23, 6, 3, CAST(83.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (24, 6, 4, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (25, 7, 1, CAST(93.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (26, 7, 2, CAST(91.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (27, 7, 3, CAST(94.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (28, 7, 4, CAST(92.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (29, 8, 1, CAST(76.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (30, 8, 2, CAST(78.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (31, 8, 3, CAST(74.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (32, 8, 4, CAST(72.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (33, 9, 1, CAST(87.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (34, 9, 2, CAST(83.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (35, 9, 3, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (36, 9, 4, CAST(84.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (37, 10, 1, CAST(97.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (38, 10, 2, CAST(95.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (39, 10, 3, CAST(96.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (40, 10, 4, CAST(98.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (41, 11, 1, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (42, 11, 2, CAST(87.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (43, 11, 3, CAST(84.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (44, 11, 4, CAST(86.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (45, 12, 1, CAST(74.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (46, 12, 2, CAST(76.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (47, 12, 3, CAST(73.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (48, 12, 4, CAST(75.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (49, 13, 1, CAST(94.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (50, 13, 2, CAST(92.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (51, 13, 3, CAST(93.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (52, 13, 4, CAST(91.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (53, 14, 1, CAST(83.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (54, 14, 2, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (55, 14, 3, CAST(82.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (56, 14, 4, CAST(84.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (57, 15, 1, CAST(77.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (58, 15, 2, CAST(79.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (59, 15, 3, CAST(76.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (60, 15, 4, CAST(78.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (61, 16, 1, CAST(86.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (62, 16, 2, CAST(88.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (63, 16, 3, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (64, 16, 4, CAST(87.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (65, 17, 1, CAST(75.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (66, 17, 2, CAST(77.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (67, 17, 3, CAST(74.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (68, 17, 4, CAST(76.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (69, 18, 1, CAST(95.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (70, 18, 2, CAST(93.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (71, 18, 3, CAST(94.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (72, 18, 4, CAST(96.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (73, 19, 1, CAST(84.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (74, 19, 2, CAST(86.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (75, 19, 3, CAST(83.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (76, 19, 4, CAST(85.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (77, 20, 1, CAST(95.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (78, 20, 2, CAST(90.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (79, 20, 3, CAST(88.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (80, 20, 4, CAST(92.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (81, 21, 1, CAST(82.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (82, 21, 2, CAST(84.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (83, 21, 3, CAST(81.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (84, 21, 4, CAST(83.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (85, 22, 1, CAST(76.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (86, 22, 2, CAST(78.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (87, 22, 3, CAST(75.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (88, 22, 4, CAST(77.00 AS Decimal(5, 2)))
SET IDENTITY_INSERT [dbo].[GradeDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Notifications] ON 

INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1, 4, N'submission', N'Submission Evaluated', N'Your submission "Blooming Dreams" has been rated as "Best".', 1, N'/dashboard/my-submissions', 1, 1, NULL, NULL, CAST(N'2025-04-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (2, 4, N'award', N'Congratulations! Award Won', N'You won "First Prize" for your submission "Blooming Dreams".', 1, N'/dashboard/my-awards', NULL, 1, 1, NULL, CAST(N'2025-06-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (3, 5, N'submission', N'Submission Evaluated', N'Your submission "Urban Geometry" has been rated as "Better".', 1, N'/dashboard/my-submissions', 1, 2, NULL, NULL, CAST(N'2025-04-05T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (4, 5, N'award', N'Congratulations! Award Won', N'You won "Second Prize" for your submission "Urban Geometry".', 1, N'/dashboard/my-awards', NULL, 2, 2, NULL, CAST(N'2025-06-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (5, 3, N'submission', N'New Submission Received', N'New submission received for Spring Art Competition 2025.', 1, N'/dashboard/submissions', 1, NULL, NULL, NULL, CAST(N'2025-03-15T00:00:00.0000000+00:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[Notifications] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (1, N'Admin')
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (5, N'Customer')
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (2, N'Manager')
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (3, N'Staff')
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (4, N'Student')
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Sales] ON 

INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (1, 1, 1, CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2025-07-15T00:00:00.000' AS DateTime))
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (2, 4, 2, CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2025-10-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (3, 6, 3, CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2026-03-12T00:00:00.000' AS DateTime))
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (4, 9, 4, CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2026-03-08T00:00:00.000' AS DateTime))
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (5, 8, 3, CAST(3500000.00 AS Decimal(18, 2)), CAST(N'2026-03-01T00:00:00.000' AS DateTime))
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (6, 7, 4, CAST(4200000.00 AS Decimal(18, 2)), CAST(N'2026-03-10T00:00:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Sales] OFF
GO
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (2, CAST(N'2020-01-15' AS Date), N'Administration', N'Manager')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (3, CAST(N'2021-06-01' AS Date), N'Fine Arts', N'Evaluator')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (9, CAST(N'2021-09-20' AS Date), N'Art & Design', N'Innovative teaching methods')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (10, CAST(N'2022-10-25' AS Date), N'Art & Design', N'Passionate about art education')
GO
SET IDENTITY_INSERT [dbo].[StudentAwards] ON 

INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (1, 1, 1, 1, CAST(N'2025-06-01' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (2, 3, 1, 1, CAST(N'2025-09-01' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (3, 2, 2, 1, CAST(N'2025-06-01' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (4, 12, 1, 1, CAST(N'2026-01-20' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (5, 14, 2, 1, CAST(N'2026-01-20' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (6, 13, 3, 1, CAST(N'2026-01-20' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (7, 17, 1, 1, CAST(N'2025-09-05' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (8, 20, 2, 1, CAST(N'2025-09-05' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (9, 25, 3, 1, CAST(N'2025-09-05' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (10, 21, 4, 1, CAST(N'2025-09-05' AS Date))
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate]) VALUES (11, 18, 5, 1, CAST(N'2025-09-05' AS Date))
SET IDENTITY_INSERT [dbo].[StudentAwards] OFF
GO
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (4, N'STU-2024-001', CAST(N'2024-09-01' AS Date), CAST(N'2005-03-15' AS Date), N'123 Art Street, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (5, N'STU-2024-002', CAST(N'2024-09-01' AS Date), CAST(N'2005-07-22' AS Date), N'456 Palette Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (6, N'STU-2024-003', CAST(N'2024-09-01' AS Date), CAST(N'2005-11-08' AS Date), N'789 Canvas Blvd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (11, N'STU-2024-004', CAST(N'2024-09-01' AS Date), CAST(N'2005-05-10' AS Date), N'321 Sculpture Lane, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (12, N'STU-2024-005', CAST(N'2024-09-01' AS Date), CAST(N'2005-08-19' AS Date), N'654 Mixed Media Rd, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (13, N'STU-2024-006', CAST(N'2024-09-01' AS Date), CAST(N'2005-02-27' AS Date), N'987 Digital Ave, Design Town')
GO
SET IDENTITY_INSERT [dbo].[SubmissionReviews] ON 

INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (1, 1, 3, N'Best', N'Exceptional use of color and composition', N'Minor perspective issues in background', N'Consider adding more depth to the background elements', CAST(N'2025-04-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (2, 2, 3, N'Better', N'Strong geometric composition and clean lines', N'Color palette could be more varied', N'Experiment with warmer tones to add visual interest', CAST(N'2025-04-05T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (3, 3, 3, N'Best', N'Innovative use of digital techniques', N'Some areas lack detail', N'Add more intricate details to the foreground', CAST(N'2025-07-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (4, 4, 3, N'Good', N'Vibrant color usage and mood', N'Composition could be more balanced', N'Work on the rule of thirds for better composition', CAST(N'2025-07-10T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (5, 12, 3, N'Best', N'Perfect winter atmosphere, masterful technique', N'None significant', N'Continue developing personal style', CAST(N'2026-01-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (6, 13, 3, N'Better', N'Excellent mood, good technique', N'Could use more contrast', N'Experiment with value contrast', CAST(N'2026-01-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (7, 14, 3, N'Best', N'Masterful composition, beautiful light', N'Minor issues with perspective', N'Continue studying perspective', CAST(N'2026-01-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (8, 15, 3, N'Good', N'Creative concept, good detail work', N'Needs more depth', N'Work on creating depth', CAST(N'2026-01-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (9, 16, 3, N'Better', N'Bold color choices, imaginative', N'Execution needs refinement', N'Practice blending techniques', CAST(N'2026-01-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (10, 17, 3, N'Best', N'Perfect color palette, great atmosphere', N'None significant', N'Continue exploring marine themes', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (11, 18, 3, N'Better', N'Excellent use of warm colors', N'Boat proportions slightly off', N'Study nautical subjects', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (12, 19, 3, N'Good', N'Good atmospheric effects', N'Could be more dynamic', N'Work on movement and energy', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (13, 20, 3, N'Best', N'Great composition, strong sense of place', N'Some color harmony issues', N'Study color theory', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (14, 21, 3, N'Better', N'Happy mood, good use of yellows', N'Repetitive elements need variation', N'Add more variety in composition', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (15, 22, 3, N'Good', N'Creative concept, vibrant colors', N'Needs better focal point', N'Study composition hierarchy', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (16, 23, 3, N'Better', N'Excellent reflections, serene mood', N'Could use more detail', N'Practice fine details', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (17, 24, 3, N'Good', N'Bold colors, lush feeling', N'Overwhelming detail', N'Learn to simplify', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (18, 25, 3, N'Best', N'Perfect mood, beautiful lighting', N'Minor anatomy issues', N'Continue figure studies', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (19, 26, 3, N'Better', N'Unique approach, good variety', N'Unity needs improvement', N'Work on creating cohesion', CAST(N'2025-09-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (20, 7, 3, N'Best', N'Outstanding use of color and composition', N'Minor perspective issue in background', N'Work on depth perception', CAST(N'2026-03-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (21, 8, 3, N'Better', N'Nice composition and color harmony', N'Could use more detail in foreground', N'Focus on texture and detail work', CAST(N'2026-03-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (22, 9, 3, N'Good', N'Beautiful color work, delicate brushstrokes', N'Composition could be stronger', N'Study composition techniques', CAST(N'2026-03-16T00:00:00.0000000+00:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[SubmissionReviews] OFF
GO
SET IDENTITY_INSERT [dbo].[Submissions] ON 

INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (1, 1, 4, N'Blooming Dreams', N'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2025-03-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, NULL, NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (2, 1, 5, N'Urban Geometry', N'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', CAST(1500000.00 AS Decimal(18, 2)), CAST(N'2025-03-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, NULL, NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (3, 2, 4, N'Digital Dreamscape', N'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', CAST(2500000.00 AS Decimal(18, 2)), CAST(N'2025-06-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, NULL, NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (4, 2, 6, N'Neon Nights', N'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400', CAST(1800000.00 AS Decimal(18, 2)), CAST(N'2025-06-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, NULL, NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (5, 3, 5, N'Abstract Harmony', N'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', CAST(3000000.00 AS Decimal(18, 2)), CAST(N'2025-09-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, NULL, NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (6, 3, 6, N'Chaos Theory', N'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2025-09-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, NULL, NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (7, 5, 4, N'Blooming Spring', N'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', CAST(2500000.00 AS Decimal(18, 2)), CAST(N'2026-03-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'A vibrant representation of spring awakening', N'Where flowers bloom, so does hope', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (8, 5, 5, N'Spring Meadow', N'https://images.unsplash.com/photo-1579783902614-a3fb3b4ae5f1?w=800', CAST(1800000.00 AS Decimal(18, 2)), CAST(N'2026-03-08T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'A peaceful spring landscape', NULL, N'In fields of green and skies of blue, Spring whispers softly fresh and new')
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (9, 5, 13, N'Cherry Blossom Dance', N'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2026-03-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Delicate cherry blossoms in full bloom', N'Beauty in fleeting moments', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (10, 5, 11, N'Butterfly Garden', N'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800', CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2026-03-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'A colorful garden full of spring butterflies', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (11, 5, 12, N'Rain and Renewal', N'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', CAST(1600000.00 AS Decimal(18, 2)), CAST(N'2026-03-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Spring rain bringing life to the earth', NULL, N'Raindrops fall on petals bright, Nature''s blessing pure delight')
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (12, 7, 4, N'Frozen Serenity', N'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=800', CAST(3000000.00 AS Decimal(18, 2)), CAST(N'2025-12-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Winter landscape with snow-covered mountains', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (13, 7, 5, N'Silent Snowfall', N'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2025-12-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Peaceful winter evening with falling snow', N'In the silence of snow, peace is found', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (14, 7, 13, N'Winter Forest', N'https://images.unsplash.com/photo-1487349384428-12b47aca925e?w=800', CAST(2800000.00 AS Decimal(18, 2)), CAST(N'2025-12-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Snow-laden trees in a quiet forest', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (15, 7, 11, N'Ice Crystal Magic', N'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800', CAST(1700000.00 AS Decimal(18, 2)), CAST(N'2025-12-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Close-up of intricate ice crystals', N'Nature''s frozen artistry', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (16, 7, 12, N'Aurora Dreams', N'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2025-12-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Northern lights over snowy landscape', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (17, 8, 4, N'Beach Paradise', N'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', CAST(3500000.00 AS Decimal(18, 2)), CAST(N'2025-07-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Tropical beach with crystal clear water', N'Summer is a state of mind', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (18, 8, 5, N'Sunset Sailing', N'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800', CAST(2700000.00 AS Decimal(18, 2)), CAST(N'2025-07-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Sailboat at sunset on calm waters', NULL, N'Golden sun meets gentle sea, Summer''s perfect harmony')
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (19, 8, 13, N'Summer Rain', N'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', CAST(1500000.00 AS Decimal(18, 2)), CAST(N'2025-07-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Refreshing summer shower in the garden', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (20, 8, 11, N'Mountain Adventure', N'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', CAST(4200000.00 AS Decimal(18, 2)), CAST(N'2025-08-01T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Summer hiking in the mountains', N'Adventure awaits in every season', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (21, 8, 12, N'Sunflower Fields', N'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800', CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2025-08-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Endless fields of blooming sunflowers', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (22, 8, 4, N'Ice Cream Dreams', N'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', CAST(1800000.00 AS Decimal(18, 2)), CAST(N'2025-08-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Colorful summer treats and beach vibes', N'Life is better with ice cream', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (23, 8, 5, N'Lakeside Serenity', N'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', CAST(2300000.00 AS Decimal(18, 2)), CAST(N'2025-08-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Peaceful summer day by the lake', NULL, N'By the lake so calm and clear, Summer''s beauty brings us near')
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (24, 8, 13, N'Tropical Paradise', N'https://images.unsplash.com/photo-1496989981497-27d69cdad83e?w=800', CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2025-08-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Lush tropical jungle in summer', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (25, 8, 11, N'Campfire Nights', N'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', CAST(3200000.00 AS Decimal(18, 2)), CAST(N'2025-08-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Summer camping under the stars', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (26, 8, 12, N'Summer Memories', N'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2025-08-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Collection of summer moments and joy', N'Summer: a season of endless possibilities', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (27, 9, 4, N'Forest Path', N'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', CAST(2800000.00 AS Decimal(18, 2)), CAST(N'2026-03-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'A serene path winding through an ancient forest', N'Into the forest I go, to lose my mind and find my soul', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (28, 9, 5, N'Mountain Majesty', N'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800', CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2026-03-21T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Majestic mountain peaks rising above the clouds', NULL, N'Mountains stand so tall and grand, Nature''s monument forever grand')
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (29, 9, 13, N'Autumn Reflections', N'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2026-03-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Perfect mirror reflection of autumn trees on a still lake', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (30, 9, 11, N'Coastal Sunset', N'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', CAST(2900000.00 AS Decimal(18, 2)), CAST(N'2026-03-23T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Dramatic sunset over rocky coastline with crashing waves', N'The ocean stirs the heart, inspires the imagination', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (31, 9, 12, N'Wildlife Encounter', N'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800', CAST(3300000.00 AS Decimal(18, 2)), CAST(N'2026-03-24T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'A curious deer in its natural forest habitat', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Submissions] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (1, N'admin', N'password123', N'Admin User', N'admin@ifa.edu', NULL, 1, 1, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (2, N'manager', N'password123', N'Manager User', N'manager@ifa.edu', NULL, 1, 2, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=manager')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (3, N'staff', N'password123', N'Staff Member', N'staff@ifa.edu', N'555-0103', 1, 3, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=staff')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (4, N'alice', N'password123', N'Alice Johnson', N'alice@student.ifa.edu', N'555-0104', 1, 4, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=alice')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (5, N'bob', N'password123', N'Bob Smith', N'bob@student.ifa.edu', N'555-0105', 1, 4, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=bob')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (6, N'carol', N'password123', N'Carol White', N'carol@student.ifa.edu', N'555-0106', 1, 4, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=carol')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (7, N'customer1', N'password123', N'Customer One', N'customer1@example.com', NULL, 1, 5, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=customer1')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (8, N'customer2', N'password123', N'Customer Two', N'customer2@example.com', NULL, 1, 5, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=customer2')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (9, N'staff2', N'password123', N'Robert Brown', N'teacher2@artschool.com', N'555-0102', 1, 3, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=robert')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (10, N'staff3', N'password123', N'Lisa Anderson', N'teacher3@artschool.com', N'555-0103', 1, 3, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (11, N'diana', N'password123', N'Diana Martinez', N'diana@student.ifa.edu', N'555-0204', 1, 4, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=diana')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (12, N'emma', N'password123', N'Emma Wilson', N'emma@student.ifa.edu', N'555-0205', 1, 4, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=emma')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (13, N'charlie', N'password123', N'Charlie Chen', N'charlie@student.ifa.edu', N'555-0203', 1, 4, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (14, N'michael', N'password123', N'Michael Brown', N'customer1@gmail.com', N'555-1001', 1, 5, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=michael')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (15, N'jessica', N'password123', N'Jessica Taylor', N'customer2@gmail.com', N'555-1002', 1, 5, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica')
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
/****** Object:  Index [UQ_CompetitionCriteria]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[CompetitionCriteria] ADD  CONSTRAINT [UQ_CompetitionCriteria] UNIQUE NONCLUSTERED 
(
	[CompetitionId] ASC,
	[CriteriaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Criteria__D27358E52842C36B]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[Criteria] ADD UNIQUE NONCLUSTERED 
(
	[CriteriaCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Customer__1788CC4D038460E5]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[Customers] ADD UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [UQ_ReviewCriteria]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[GradeDetails] ADD  CONSTRAINT [UQ_ReviewCriteria] UNIQUE NONCLUSTERED 
(
	[ReviewId] ASC,
	[CriteriaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Notifications_UserId_IsRead]    Script Date: 23/03/2026 1:29:14 CH ******/
CREATE NONCLUSTERED INDEX [IX_Notifications_UserId_IsRead] ON [dbo].[Notifications]
(
	[UserId] ASC,
	[IsRead] ASC,
	[CreatedAt] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Roles__8A2B61603F7A48D6]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Students__B468CC9711CF047E]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[Students] ADD UNIQUE NONCLUSTERED 
(
	[AdmissionNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Submissi__449EE1245518270F]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[SubmissionReviews] ADD UNIQUE NONCLUSTERED 
(
	[SubmissionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__536C85E4EFEDB06D]    Script Date: 23/03/2026 1:29:14 CH ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Competitions] ADD  DEFAULT ('Upcoming') FOR [Status]
GO
ALTER TABLE [dbo].[Criteria] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Customers] ADD  DEFAULT (sysdatetimeoffset()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Exhibitions] ADD  DEFAULT ('Planned') FOR [Status]
GO
ALTER TABLE [dbo].[ExhibitionSubmissions] ADD  DEFAULT ('Available') FOR [Status]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT (sysdatetimeoffset()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Sales] ADD  DEFAULT (getdate()) FOR [SoldDate]
GO
ALTER TABLE [dbo].[StudentAwards] ADD  DEFAULT (getdate()) FOR [AwardedDate]
GO
ALTER TABLE [dbo].[SubmissionReviews] ADD  DEFAULT (sysdatetimeoffset()) FOR [ReviewedAt]
GO
ALTER TABLE [dbo].[Submissions] ADD  DEFAULT ((0)) FOR [ProposedPrice]
GO
ALTER TABLE [dbo].[Submissions] ADD  DEFAULT (sysdatetimeoffset()) FOR [SubmittedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (sysdatetimeoffset()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CompetitionCriteria]  WITH CHECK ADD  CONSTRAINT [FK_CC_Competition] FOREIGN KEY([CompetitionId])
REFERENCES [dbo].[Competitions] ([Id])
GO
ALTER TABLE [dbo].[CompetitionCriteria] CHECK CONSTRAINT [FK_CC_Competition]
GO
ALTER TABLE [dbo].[CompetitionCriteria]  WITH CHECK ADD  CONSTRAINT [FK_CC_Criteria] FOREIGN KEY([CriteriaId])
REFERENCES [dbo].[Criteria] ([Id])
GO
ALTER TABLE [dbo].[CompetitionCriteria] CHECK CONSTRAINT [FK_CC_Criteria]
GO
ALTER TABLE [dbo].[Competitions]  WITH CHECK ADD  CONSTRAINT [FK_Competitions_Users_Creator] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Competitions] CHECK CONSTRAINT [FK_Competitions_Users_Creator]
GO
ALTER TABLE [dbo].[Customers]  WITH CHECK ADD  CONSTRAINT [FK_Customers_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Customers] CHECK CONSTRAINT [FK_Customers_Users]
GO
ALTER TABLE [dbo].[ExhibitionSubmissions]  WITH CHECK ADD  CONSTRAINT [FK_ExhSub_Exhibitions] FOREIGN KEY([ExhibitionId])
REFERENCES [dbo].[Exhibitions] ([Id])
GO
ALTER TABLE [dbo].[ExhibitionSubmissions] CHECK CONSTRAINT [FK_ExhSub_Exhibitions]
GO
ALTER TABLE [dbo].[ExhibitionSubmissions]  WITH CHECK ADD  CONSTRAINT [FK_ExhSub_Submissions] FOREIGN KEY([SubmissionId])
REFERENCES [dbo].[Submissions] ([Id])
GO
ALTER TABLE [dbo].[ExhibitionSubmissions] CHECK CONSTRAINT [FK_ExhSub_Submissions]
GO
ALTER TABLE [dbo].[GradeDetails]  WITH CHECK ADD  CONSTRAINT [FK_GradeDetails_Criteria] FOREIGN KEY([CriteriaId])
REFERENCES [dbo].[Criteria] ([Id])
GO
ALTER TABLE [dbo].[GradeDetails] CHECK CONSTRAINT [FK_GradeDetails_Criteria]
GO
ALTER TABLE [dbo].[GradeDetails]  WITH CHECK ADD  CONSTRAINT [FK_GradeDetails_Reviews] FOREIGN KEY([ReviewId])
REFERENCES [dbo].[SubmissionReviews] ([Id])
GO
ALTER TABLE [dbo].[GradeDetails] CHECK CONSTRAINT [FK_GradeDetails_Reviews]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notif_Award] FOREIGN KEY([AwardId])
REFERENCES [dbo].[Awards] ([Id])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notif_Award]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notif_Competition] FOREIGN KEY([CompetitionId])
REFERENCES [dbo].[Competitions] ([Id])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notif_Competition]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notif_Exhibition] FOREIGN KEY([ExhibitionId])
REFERENCES [dbo].[Exhibitions] ([Id])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notif_Exhibition]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notif_Submission] FOREIGN KEY([SubmissionId])
REFERENCES [dbo].[Submissions] ([Id])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notif_Submission]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notif_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notif_Users]
GO
ALTER TABLE [dbo].[Sales]  WITH CHECK ADD  CONSTRAINT [FK_Sales_Customers] FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customers] ([Id])
GO
ALTER TABLE [dbo].[Sales] CHECK CONSTRAINT [FK_Sales_Customers]
GO
ALTER TABLE [dbo].[Sales]  WITH CHECK ADD  CONSTRAINT [FK_Sales_ExhSub] FOREIGN KEY([ExhibitionSubmissionId])
REFERENCES [dbo].[ExhibitionSubmissions] ([Id])
GO
ALTER TABLE [dbo].[Sales] CHECK CONSTRAINT [FK_Sales_ExhSub]
GO
ALTER TABLE [dbo].[Staffs]  WITH CHECK ADD  CONSTRAINT [FK_Staffs_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Staffs] CHECK CONSTRAINT [FK_Staffs_Users]
GO
ALTER TABLE [dbo].[StudentAwards]  WITH CHECK ADD  CONSTRAINT [FK_StudentAwards_Admin] FOREIGN KEY([AwardedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[StudentAwards] CHECK CONSTRAINT [FK_StudentAwards_Admin]
GO
ALTER TABLE [dbo].[StudentAwards]  WITH CHECK ADD  CONSTRAINT [FK_StudentAwards_Awards] FOREIGN KEY([AwardId])
REFERENCES [dbo].[Awards] ([Id])
GO
ALTER TABLE [dbo].[StudentAwards] CHECK CONSTRAINT [FK_StudentAwards_Awards]
GO
ALTER TABLE [dbo].[StudentAwards]  WITH CHECK ADD  CONSTRAINT [FK_StudentAwards_Submissions] FOREIGN KEY([SubmissionId])
REFERENCES [dbo].[Submissions] ([Id])
GO
ALTER TABLE [dbo].[StudentAwards] CHECK CONSTRAINT [FK_StudentAwards_Submissions]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Users]
GO
ALTER TABLE [dbo].[SubmissionReviews]  WITH CHECK ADD  CONSTRAINT [FK_Reviews_Staffs] FOREIGN KEY([StaffId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[SubmissionReviews] CHECK CONSTRAINT [FK_Reviews_Staffs]
GO
ALTER TABLE [dbo].[SubmissionReviews]  WITH CHECK ADD  CONSTRAINT [FK_Reviews_Submissions] FOREIGN KEY([SubmissionId])
REFERENCES [dbo].[Submissions] ([Id])
GO
ALTER TABLE [dbo].[SubmissionReviews] CHECK CONSTRAINT [FK_Reviews_Submissions]
GO
ALTER TABLE [dbo].[Submissions]  WITH CHECK ADD  CONSTRAINT [FK_Submissions_Competitions] FOREIGN KEY([CompetitionId])
REFERENCES [dbo].[Competitions] ([Id])
GO
ALTER TABLE [dbo].[Submissions] CHECK CONSTRAINT [FK_Submissions_Competitions]
GO
ALTER TABLE [dbo].[Submissions]  WITH CHECK ADD  CONSTRAINT [FK_Submissions_Users] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Submissions] CHECK CONSTRAINT [FK_Submissions_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles]
GO
ALTER TABLE [dbo].[CompetitionCriteria]  WITH CHECK ADD  CONSTRAINT [CK_CC_WeightPercent] CHECK  (([WeightPercent]>(0) AND [WeightPercent]<=(100)))
GO
ALTER TABLE [dbo].[CompetitionCriteria] CHECK CONSTRAINT [CK_CC_WeightPercent]
GO
ALTER TABLE [dbo].[ExhibitionSubmissions]  WITH CHECK ADD CHECK  (([ProposedPrice]>=(0)))
GO
ALTER TABLE [dbo].[GradeDetails]  WITH CHECK ADD  CONSTRAINT [CK_GradeDetails_RawScore] CHECK  (([RawScore]>=(0) AND [RawScore]<=(100)))
GO
ALTER TABLE [dbo].[GradeDetails] CHECK CONSTRAINT [CK_GradeDetails_RawScore]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [CK_Notif_Type] CHECK  (([Type]='announcement' OR [Type]='purchase' OR [Type]='exhibition' OR [Type]='competition' OR [Type]='submission' OR [Type]='award'))
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [CK_Notif_Type]
GO
ALTER TABLE [dbo].[Sales]  WITH CHECK ADD CHECK  (([SoldPrice]>=(0)))
GO
ALTER TABLE [dbo].[SubmissionReviews]  WITH CHECK ADD  CONSTRAINT [CK_RatingLevel] CHECK  (([RatingLevel]=N'Disqualified' OR [RatingLevel]=N'Normal' OR [RatingLevel]=N'Moderate' OR [RatingLevel]=N'Good' OR [RatingLevel]=N'Better' OR [RatingLevel]=N'Best'))
GO
ALTER TABLE [dbo].[SubmissionReviews] CHECK CONSTRAINT [CK_RatingLevel]
GO
/****** Object:  StoredProcedure [dbo].[sp_BroadcastAnnouncement]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- STORED PROCEDURE: Broadcast announcement to all users (or by role)
-- =============================================
CREATE   PROCEDURE [dbo].[sp_BroadcastAnnouncement]
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
/****** Object:  StoredProcedure [dbo].[sp_MarkNotificationsRead]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- STORED PROCEDURE: Mark notification(s) as read
-- =============================================
CREATE   PROCEDURE [dbo].[sp_MarkNotificationsRead]
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
/****** Object:  Trigger [dbo].[TRG_CompetitionCriteria_WeightSum_100]    Script Date: 23/03/2026 1:29:14 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

CREATE   TRIGGER [dbo].[TRG_CompetitionCriteria_WeightSum_100]
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
    WHERE ABS(x.TotalWeight - 100.0) > 0.01;

    IF @Bad > 0
    BEGIN
        RAISERROR (N'Tá»•ng WeightPercent cá»§a má»—i cuá»™c thi pháº£i báº±ng 100 (%)', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;

GO
ALTER TABLE [dbo].[CompetitionCriteria] ENABLE TRIGGER [TRG_CompetitionCriteria_WeightSum_100]
GO
/****** Object:  Trigger [dbo].[TRG_Notif_CompetitionStatus]    Script Date: 23/03/2026 1:29:15 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- TRIGGER: Auto-notify students when competition status changes
-- =============================================
CREATE   TRIGGER [dbo].[TRG_Notif_CompetitionStatus]
ON [dbo].[Competitions]
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
ALTER TABLE [dbo].[Competitions] ENABLE TRIGGER [TRG_Notif_CompetitionStatus]
GO
/****** Object:  Trigger [dbo].[TRG_Notif_ExhibitionAdded]    Script Date: 23/03/2026 1:29:15 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- TRIGGER: Auto-notify student when artwork added to exhibition
-- =============================================
CREATE   TRIGGER [dbo].[TRG_Notif_ExhibitionAdded]
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
    JOIN Submissions s  ON s.Id = i.SubmissionId
    JOIN Exhibitions e  ON e.Id = i.ExhibitionId;
END;

GO
ALTER TABLE [dbo].[ExhibitionSubmissions] ENABLE TRIGGER [TRG_Notif_ExhibitionAdded]
GO
/****** Object:  Trigger [dbo].[TRG_Notif_ArtworkSold]    Script Date: 23/03/2026 1:29:15 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- TRIGGER: Auto-notify student when artwork is sold
-- =============================================
CREATE   TRIGGER [dbo].[TRG_Notif_ArtworkSold]
ON [dbo].[Sales]
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
ALTER TABLE [dbo].[Sales] ENABLE TRIGGER [TRG_Notif_ArtworkSold]
GO
/****** Object:  Trigger [dbo].[TRG_Notif_AwardGranted]    Script Date: 23/03/2026 1:29:15 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- TRIGGER: Auto-notify student when award is granted
-- =============================================
CREATE   TRIGGER [dbo].[TRG_Notif_AwardGranted]
ON [dbo].[StudentAwards]
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
ALTER TABLE [dbo].[StudentAwards] ENABLE TRIGGER [TRG_Notif_AwardGranted]
GO
/****** Object:  Trigger [dbo].[TRG_Notif_SubmissionReviewed]    Script Date: 23/03/2026 1:29:15 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

-- =============================================
-- TRIGGER: Auto-notify student when submission is reviewed
-- =============================================
CREATE   TRIGGER [dbo].[TRG_Notif_SubmissionReviewed]
ON [dbo].[SubmissionReviews]
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
        N'Staff reviewed "' + ISNULL(s.Title, N'Untitled') + N'" â€” rated ' + i.RatingLevel + N'.',
        N'/dashboard/submissions',
        s.Id,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s ON s.Id = i.SubmissionId
    CROSS JOIN (SELECT Id FROM Users WHERE RoleId = (SELECT Id FROM Roles WHERE RoleName = 'Manager')) u;
END;

GO
ALTER TABLE [dbo].[SubmissionReviews] ENABLE TRIGGER [TRG_Notif_SubmissionReviewed]
GO
USE [master]
GO
ALTER DATABASE [FineArtsInstitute_Final] SET  READ_WRITE 
GO

-- RefreshTokens FK and index
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_RefreshTokens_Users')
ALTER TABLE [dbo].[RefreshTokens] WITH CHECK ADD CONSTRAINT [FK_RefreshTokens_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RefreshTokens_Token' AND object_id = OBJECT_ID('RefreshTokens'))
CREATE NONCLUSTERED INDEX [IX_RefreshTokens_Token] ON [dbo].[RefreshTokens] ([Token] ASC)
GO
