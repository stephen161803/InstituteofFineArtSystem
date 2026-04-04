USE [master]
GO
/****** Object:  Database [FineArtsInstitute_Final]    Script Date: 03/04/2026 11:03:38 CH ******/
CREATE DATABASE [FineArtsInstitute_Final]
GO
 
USE [FineArtsInstitute_Final]
GO
/****** Object:  Table [dbo].[CompetitionCriteria]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Submissions]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Submissions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompetitionId] [int] NOT NULL,
	[StudentId] [int] NOT NULL,
	[Title] [nvarchar](200) NULL,
	[WorkUrl] [nvarchar](max) NULL,
	[ProposedPrice] [decimal](18, 2) NULL,
	[SubmittedAt] [datetimeoffset](7) NULL,
	[FileName] [nvarchar](500) NULL,
	[Description] [nvarchar](max) NULL,
	[Quotation] [nvarchar](max) NULL,
	[Poem] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SubmissionReviews]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GradeDetails]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_SubmissionTotalScore]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_SubmissionTotalScore] AS
SELECT sr.SubmissionId,
       SUM(gd.RawScore * cc.WeightPercent / 100.0) AS TotalScore_0_100
FROM SubmissionReviews sr
JOIN GradeDetails gd       ON gd.ReviewId   = sr.Id
JOIN Submissions s          ON s.Id          = sr.SubmissionId
JOIN CompetitionCriteria cc ON cc.CompetitionId = s.CompetitionId
                           AND cc.CriteriaId    = gd.CriteriaId
GROUP BY sr.SubmissionId
GO
/****** Object:  Table [dbo].[Notifications]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_UnreadNotificationCount]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_UnreadNotificationCount] AS
SELECT UserId, COUNT(*) AS UnreadCount
FROM Notifications
WHERE IsRead = 0
GROUP BY UserId
GO
/****** Object:  Table [dbo].[Awards]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CompetitionAwards]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompetitionAwards](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompetitionId] [int] NOT NULL,
	[AwardId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Competitions]    Script Date: 03/04/2026 11:03:38 CH ******/
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
	[IsDeleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Criteria]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Exhibitions]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExhibitionSubmissions]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RefreshTokens]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RefreshTokens](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Token] [nvarchar](500) NOT NULL,
	[ExpiresAt] [datetimeoffset](7) NOT NULL,
	[IsRevoked] [bit] NOT NULL,
	[CreatedAt] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sales]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Staffs]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentAwards]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentAwards](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SubmissionId] [int] NOT NULL,
	[AwardId] [int] NULL,
	[AwardedBy] [int] NOT NULL,
	[AwardedDate] [date] NULL,
	[CompetitionAwardId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Students]    Script Date: 03/04/2026 11:03:38 CH ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 03/04/2026 11:03:38 CH ******/
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
	[AvatarUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Awards] ON 

INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (1, N'First Prize', N'Awarded to the best submission in the competition')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (2, N'Second Prize', N'Awarded to the second-best submission in the competition')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (3, N'Third Prize', N'Awarded to the third-best submission in the competition')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (4, N'Honorable Mention', N'Special recognition for outstanding creativity')
INSERT [dbo].[Awards] ([Id], [AwardName], [Description]) VALUES (5, N'Best Use of Color', N'Awarded for exceptional use of color in artwork')
SET IDENTITY_INSERT [dbo].[Awards] OFF
GO
SET IDENTITY_INSERT [dbo].[CompetitionAwards] ON 

INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (1, 1, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (2, 1, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (3, 2, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (4, 7, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (5, 7, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (6, 7, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (7, 8, 5)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (8, 8, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (9, 8, 4)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (10, 8, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (11, 8, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (19, 6, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (20, 6, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (21, 6, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (22, 21, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (23, 21, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (24, 21, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (25, 9, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (26, 9, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (27, 9, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (28, 18, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (29, 18, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (30, 18, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (31, 15, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (32, 15, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (33, 15, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (34, 15, 4)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (35, 14, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (36, 14, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (37, 14, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (38, 10, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (39, 10, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (40, 10, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (41, 13, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (42, 13, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (43, 13, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (44, 5, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (45, 5, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (46, 5, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (47, 11, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (48, 11, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (49, 11, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (50, 12, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (51, 12, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (52, 12, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (53, 4, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (54, 4, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (55, 4, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (56, 20, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (57, 20, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (58, 20, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (59, 17, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (60, 17, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (61, 17, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (68, 3, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (69, 3, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (70, 3, 3)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (71, 16, 1)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (72, 16, 2)
INSERT [dbo].[CompetitionAwards] ([Id], [CompetitionId], [AwardId]) VALUES (73, 16, 3)
SET IDENTITY_INSERT [dbo].[CompetitionAwards] OFF
GO
SET IDENTITY_INSERT [dbo].[CompetitionCriteria] ON 

INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1, 1, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (2, 1, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (3, 1, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (4, 1, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (29, 8, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (30, 8, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (31, 8, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (32, 8, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (73, 19, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (74, 19, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (75, 19, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (76, 19, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1013, 6, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1014, 6, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1015, 6, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1016, 6, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1017, 21, 1, CAST(100.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1018, 9, 1, CAST(20.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1019, 9, 2, CAST(30.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1020, 9, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1021, 9, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1022, 18, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1023, 18, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1024, 18, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1025, 18, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1026, 15, 1, CAST(40.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1027, 15, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1028, 15, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1029, 15, 4, CAST(10.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1030, 14, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1031, 14, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1032, 14, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1033, 14, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1034, 10, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1035, 10, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1036, 10, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1037, 10, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1038, 13, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1039, 13, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1040, 13, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1041, 13, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1058, 5, 1, CAST(30.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1059, 5, 2, CAST(20.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1060, 5, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1061, 5, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1062, 11, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1063, 11, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1064, 11, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1065, 11, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1066, 12, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1067, 12, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1068, 12, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1069, 12, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1070, 4, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1071, 4, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1072, 4, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1073, 4, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1074, 20, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1075, 20, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1076, 20, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1077, 20, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1078, 17, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1079, 17, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1080, 17, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1081, 17, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1090, 3, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1091, 3, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1092, 3, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1093, 3, 4, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1094, 16, 1, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1095, 16, 2, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1096, 16, 3, CAST(25.00 AS Decimal(6, 2)))
INSERT [dbo].[CompetitionCriteria] ([Id], [CompetitionId], [CriteriaId], [WeightPercent]) VALUES (1097, 16, 4, CAST(25.00 AS Decimal(6, 2)))
SET IDENTITY_INSERT [dbo].[CompetitionCriteria] OFF
GO
SET IDENTITY_INSERT [dbo].[Competitions] ON 

INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (1, N'Spring Art Competition 2025', N'Annual spring competition celebrating creativity and artistic expression', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-05-31T00:00:00.000' AS DateTime), 1, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (2, N'Digital Art Showcase 2025', N'Explore the intersection of technology and traditional art forms', CAST(N'2025-06-01T00:00:00.000' AS DateTime), CAST(N'2025-08-31T00:00:00.000' AS DateTime), 1, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (3, N'Abstract Expressions 2025', N'A competition focused on abstract and experimental art techniques', CAST(N'2025-09-01T00:00:00.000' AS DateTime), CAST(N'2025-11-30T00:00:00.000' AS DateTime), 1, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (4, N'Winter Wonderland Art 2025', N'Capture the magic of winter through your artistic vision', CAST(N'2025-12-01T00:00:00.000' AS DateTime), CAST(N'2026-02-28T00:00:00.000' AS DateTime), 1, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (5, N'Spring Art Festival 2026', N'Celebrate spring with vibrant paintings', CAST(N'2026-04-01T00:00:00.000' AS DateTime), CAST(N'2026-04-02T00:00:00.000' AS DateTime), 3, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (6, N'Abstract Expression Contest', N'Explore abstract art techniques. Any medium accepted', CAST(N'2026-04-01T00:00:00.000' AS DateTime), CAST(N'2026-04-30T00:00:00.000' AS DateTime), 9, N'Ongoing', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (7, N'Winter Wonderland 2025', N'Winter themed artwork competition', CAST(N'2025-12-01T00:00:00.000' AS DateTime), CAST(N'2026-01-15T00:00:00.000' AS DateTime), 3, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (8, N'Summer Creativity Challenge 2025', N'Showcase your creativity with summer-inspired artwork', CAST(N'2025-06-01T00:00:00.000' AS DateTime), CAST(N'2025-08-31T00:00:00.000' AS DateTime), 10, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (9, N'Nature Photography Challenge', N'Capture the beauty of nature through your lens. Max 3 submissions/student', CAST(N'2026-03-15T00:00:00.000' AS DateTime), CAST(N'2026-04-15T00:00:00.000' AS DateTime), 9, N'Ongoing', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (10, N'Digital Art Revolution 2026', N'Push the boundaries of digital art and animation', CAST(N'2026-05-01T00:00:00.000' AS DateTime), CAST(N'2026-06-30T00:00:00.000' AS DateTime), 10, N'Upcoming', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (11, N'Portrait Masters 2026', N'Showcase your skills in portrait painting and drawing', CAST(N'2026-02-01T00:00:00.000' AS DateTime), CAST(N'2026-03-15T00:00:00.000' AS DateTime), 16, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (12, N'Sculpture Innovation Contest', N'Push the boundaries of three-dimensional art', CAST(N'2026-01-15T00:00:00.000' AS DateTime), CAST(N'2026-03-20T00:00:00.000' AS DateTime), 18, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (13, N'Urban Street Art Challenge', N'Celebrate urban culture through street art and graffiti', CAST(N'2026-04-10T00:00:00.000' AS DateTime), CAST(N'2026-05-30T00:00:00.000' AS DateTime), 20, N'Upcoming', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (14, N'Watercolor Wonderland', N'Demonstrate mastery in watercolor techniques', CAST(N'2026-05-15T00:00:00.000' AS DateTime), CAST(N'2026-06-20T00:00:00.000' AS DateTime), 3, N'Upcoming', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (15, N'Mixed Media Mastery', N'Combine different mediums to create unique artworks', CAST(N'2026-06-01T00:00:00.000' AS DateTime), CAST(N'2026-07-15T00:00:00.000' AS DateTime), 20, N'Upcoming', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (16, N'Autumn Colors Festival 2025', N'Capture the beauty of autumn in your artwork', CAST(N'2025-09-01T00:00:00.000' AS DateTime), CAST(N'2025-10-31T00:00:00.000' AS DateTime), 9, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (17, N'Character Design Competition', N'Create original characters for animation or comics', CAST(N'2025-10-15T00:00:00.000' AS DateTime), CAST(N'2025-12-01T00:00:00.000' AS DateTime), 17, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (18, N'Architectural Visions', N'Draw and paint buildings and architectural wonders', CAST(N'2026-03-01T00:00:00.000' AS DateTime), CAST(N'2026-04-10T00:00:00.000' AS DateTime), 21, N'Ongoing', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (19, N'Fantasy Art Realm', N'Bring fantasy worlds and creatures to life', CAST(N'2026-07-01T00:00:00.000' AS DateTime), CAST(N'2026-08-15T00:00:00.000' AS DateTime), 17, N'Upcoming', 1)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (20, N'Black and White Excellence', N'Master the art of monochrome artwork', CAST(N'2025-11-01T00:00:00.000' AS DateTime), CAST(N'2025-12-20T00:00:00.000' AS DateTime), 22, N'Completed', 0)
INSERT [dbo].[Competitions] ([Id], [Title], [Description], [StartDate], [EndDate], [CreatedBy], [Status], [IsDeleted]) VALUES (21, N'Abstract Expression Contest 2026', N'', CAST(N'2026-04-01T00:00:00.000' AS DateTime), CAST(N'2026-04-30T00:00:00.000' AS DateTime), 3, N'Ongoing', 0)
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

INSERT [dbo].[Customers] ([Id], [UserId], [Address], [Notes], [CreatedAt]) VALUES (1, 7, N'k, m, m', NULL, CAST(N'2026-03-22T22:57:13.8836476+07:00' AS DateTimeOffset))
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
INSERT [dbo].[Exhibitions] ([Id], [Title], [Location], [StartDate], [EndDate], [Status]) VALUES (6, N'abc', N'abc', CAST(N'2026-04-05' AS Date), CAST(N'2026-04-25' AS Date), N'Upcoming')
SET IDENTITY_INSERT [dbo].[Exhibitions] OFF
GO
SET IDENTITY_INSERT [dbo].[ExhibitionSubmissions] ON 

INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (1, 1, 1, CAST(2000000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (2, 1, 2, CAST(1500000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (3, 2, 3, CAST(2500000.00 AS Decimal(18, 2)), N'Available')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (4, 2, 4, CAST(1800000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (5, 3, 7, CAST(2500000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (6, 3, 8, CAST(1800000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (7, 3, 11, CAST(1600000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (8, 4, 12, CAST(3000000.00 AS Decimal(18, 2)), N'Sold')
INSERT [dbo].[ExhibitionSubmissions] ([Id], [ExhibitionId], [SubmissionId], [ProposedPrice], [Status]) VALUES (9, 4, 9, CAST(2100000.00 AS Decimal(18, 2)), N'Sold')
-- Removed ExhibitionSubmissions 10-14 (submissions 27-31 from Ongoing competition)
-- Removed ExhibitionSubmission 15 (submission 93 from Ongoing competition, no review)
SET IDENTITY_INSERT [dbo].[ExhibitionSubmissions] OFF
GO
SET IDENTITY_INSERT [dbo].[GradeDetails] ON 

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
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (89, 1, 1, CAST(100.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (90, 1, 2, CAST(100.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (91, 1, 3, CAST(100.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (92, 1, 4, CAST(100.00 AS Decimal(5, 2)))
-- Review 24: Sub 10 (Butterfly Garden), Comp 5 - Good rating
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (93, 24, 1, CAST(76.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (94, 24, 2, CAST(74.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (95, 24, 3, CAST(78.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (96, 24, 4, CAST(72.00 AS Decimal(5, 2)))
-- Review 25: Sub 11 (Rain and Renewal), Comp 5 - Best rating
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (97, 25, 1, CAST(94.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (98, 25, 2, CAST(92.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (99, 25, 3, CAST(96.00 AS Decimal(5, 2)))
INSERT [dbo].[GradeDetails] ([Id], [ReviewId], [CriteriaId], [RawScore]) VALUES (100, 25, 4, CAST(93.00 AS Decimal(5, 2)))
SET IDENTITY_INSERT [dbo].[GradeDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Notifications] ON 

INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1, 4, N'submission', N'Submission Evaluated', N'Your submission "Blooming Dreams" has been rated as "Best".', 1, N'/dashboard/my-submissions', 1, 1, NULL, NULL, CAST(N'2025-04-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (2, 4, N'award', N'Congratulations! Award Won', N'You won "First Prize" for your submission "Blooming Dreams".', 1, N'/dashboard/my-awards', NULL, 1, 1, NULL, CAST(N'2025-06-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (3, 5, N'submission', N'Submission Evaluated', N'Your submission "Urban Geometry" has been rated as "Better".', 1, N'/dashboard/my-submissions', 1, 2, NULL, NULL, CAST(N'2025-04-05T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (4, 5, N'award', N'Congratulations! Award Won', N'You won "Second Prize" for your submission "Urban Geometry".', 1, N'/dashboard/my-awards', NULL, 2, 2, NULL, CAST(N'2025-06-01T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (5, 3, N'submission', N'New Submission Received', N'New submission received for Spring Art Competition 2025.', 1, N'/dashboard/submissions', 1, NULL, NULL, NULL, CAST(N'2025-03-15T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (6, 4, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (7, 5, N'competition', N'Competition Ended', N'Competition "Abstract Expressions 2025" is now Completed', 0, N'/dashboard/competitions', 3, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (8, 5, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 0, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (9, 6, N'competition', N'Competition Ended', N'Competition "Abstract Expressions 2025" is now Completed', 0, N'/dashboard/competitions', 3, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (10, 11, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (11, 12, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (12, 13, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 0, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (13, 23, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (14, 24, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (15, 25, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (16, 26, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (17, 27, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (18, 28, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (19, 29, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (20, 30, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (21, 31, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (22, 32, N'competition', N'Competition Ended', N'Competition "Portrait Masters 2026" is now Completed', 0, N'/dashboard/competitions', 11, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (23, 33, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (24, 34, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (25, 35, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (26, 36, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (27, 37, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (28, 38, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (29, 39, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (30, 40, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (31, 41, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (32, 42, N'competition', N'Competition Ended', N'Competition "Sculpture Innovation Contest" is now Completed', 0, N'/dashboard/competitions', 12, NULL, NULL, NULL, CAST(N'2026-04-02T02:04:57.0019095+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (33, 4, N'competition', N'Competition Started', N'Competition "Spring Art Festival 2026" is now Ongoing', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T10:59:17.7442580+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (34, 5, N'competition', N'Competition Started', N'Competition "Spring Art Festival 2026" is now Ongoing', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T10:59:17.7442580+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (35, 11, N'competition', N'Competition Started', N'Competition "Spring Art Festival 2026" is now Ongoing', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T10:59:17.7442580+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (36, 12, N'competition', N'Competition Started', N'Competition "Spring Art Festival 2026" is now Ongoing', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T10:59:17.7442580+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (37, 13, N'competition', N'Competition Started', N'Competition "Spring Art Festival 2026" is now Ongoing', 0, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T10:59:17.7442580+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1001, 4, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T23:02:13.6943565+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1002, 5, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 0, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T23:02:13.6943565+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1003, 11, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T23:02:13.6943565+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1004, 12, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 1, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T23:02:13.6943565+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1005, 13, N'competition', N'Competition Ended', N'Competition "Spring Art Festival 2026" is now Completed', 0, N'/dashboard/competitions', 5, NULL, NULL, NULL, CAST(N'2026-04-02T23:02:13.6943565+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1006, 12, N'purchase', N'Your Artwork Was Sold', N'"Rain and Renewal" was sold for $1,600,000.', 1, N'/dashboard/my-submissions', NULL, 11, NULL, 3, CAST(N'2026-04-03T00:07:59.2536506+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1007, 7, N'purchase', N'Purchase Confirmed', N'You have successfully purchased "Rain and Renewal" for $1,600,000.', 0, N'/dashboard', NULL, 11, NULL, 3, CAST(N'2026-04-03T00:07:59.4175428+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1008, 2, N'purchase', N'Artwork Sold', N'"Rain and Renewal" sold for $1,600,000.', 0, N'/dashboard/exhibitions', NULL, 11, NULL, 3, CAST(N'2026-04-03T00:07:59.4175428+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1009, 13, N'purchase', N'Your Artwork Was Sold', N'"Autumn Reflections" was sold for $2,200,000.', 0, N'/dashboard/my-submissions', NULL, 29, NULL, 5, CAST(N'2026-04-03T00:10:02.1574622+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1010, 8, N'purchase', N'Purchase Confirmed', N'You have successfully purchased "Autumn Reflections" for $2,200,000.', 0, N'/dashboard', NULL, 29, NULL, 5, CAST(N'2026-04-03T00:10:02.1580378+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1011, 2, N'purchase', N'Artwork Sold', N'"Autumn Reflections" sold for $2,200,000.', 0, N'/dashboard/exhibitions', NULL, 29, NULL, 5, CAST(N'2026-04-03T00:10:02.1580378+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1012, 4, N'purchase', N'Your Artwork Was Sold', N'"Forest Path" was sold for $2,800,000.', 1, N'/dashboard/my-submissions', NULL, 27, NULL, 5, CAST(N'2026-04-03T00:13:58.2168609+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1013, 15, N'purchase', N'Purchase Confirmed', N'You have successfully purchased "Forest Path" for $2,800,000.', 0, N'/dashboard', NULL, 27, NULL, 5, CAST(N'2026-04-03T00:13:58.2178920+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1014, 2, N'purchase', N'Artwork Sold', N'"Forest Path" sold for $2,800,000.', 0, N'/dashboard/exhibitions', NULL, 27, NULL, 5, CAST(N'2026-04-03T00:13:58.2188937+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1015, 4, N'award', N'Congratulations! Award Won', N'You won "First Prize" for your submission "Beach Paradise".', 0, N'/dashboard/my-awards', 8, 17, NULL, NULL, CAST(N'2026-04-03T00:54:04.5649133+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1016, 11, N'award', N'Congratulations! Award Won', N'You won "Third Prize" for your submission "Mountain Adventure".', 0, N'/dashboard/my-awards', 8, 20, NULL, NULL, CAST(N'2026-04-03T00:54:04.6018568+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1017, 11, N'award', N'Congratulations! Award Won', N'You won "Second Prize" for your submission "Campfire Nights".', 0, N'/dashboard/my-awards', 8, 25, NULL, NULL, CAST(N'2026-04-03T00:54:04.6118571+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1018, 4, N'award', N'Congratulations! Award Won', N'You won "Best Use of Color" for your submission "Beach Paradise".', 1, N'/dashboard/my-awards', 8, 17, NULL, NULL, CAST(N'2026-04-03T01:08:31.6261104+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1019, 4, N'award', N'Congratulations! Award Won', N'You won "Best Use of Color" for your submission "Beach Paradise".', 1, N'/dashboard/my-awards', 8, 17, NULL, NULL, CAST(N'2026-04-03T01:08:48.6771106+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1020, 4, N'award', N'Congratulations! Award Won', N'You won "First Prize" for your submission "Frozen Serenity".', 1, N'/dashboard/my-awards', 7, 12, NULL, NULL, CAST(N'2026-04-03T01:11:19.9422866+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1021, 13, N'award', N'Congratulations! Award Won', N'You won "Second Prize" for your submission "Winter Forest".', 0, N'/dashboard/my-awards', 7, 14, NULL, NULL, CAST(N'2026-04-03T01:11:19.9572773+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1022, 13, N'award', N'Congratulations! Award Won', N'You won "Second Prize" for your submission "Winter Forest".', 0, N'/dashboard/my-awards', 7, 14, NULL, NULL, CAST(N'2026-04-03T22:46:17.7304865+07:00' AS DateTimeOffset))
INSERT [dbo].[Notifications] ([Id], [UserId], [Type], [Title], [Message], [IsRead], [Link], [CompetitionId], [SubmissionId], [AwardId], [ExhibitionId], [CreatedAt]) VALUES (1023, 12, N'award', N'Congratulations! Award Won', N'You won "Third Prize" for your submission "Aurora Dreams".', 0, N'/dashboard/my-awards', 7, 16, NULL, NULL, CAST(N'2026-04-03T22:46:17.7743615+07:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[Notifications] OFF
GO
SET IDENTITY_INSERT [dbo].[RefreshTokens] ON 

INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1, 4, N'F2LTJlWaVvxslfBkCxPf5XMlwPPKHS8i96ia94cIrNDbXpynatdq8ZgDM59hPpTNAcFvIdDsFlbES9APZ1QlfA==', CAST(N'2026-04-04T19:05:16.5753005+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-01T19:05:16.5740252+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (2, 3, N'vkWdfn/1S5hHAijCoEtc5fYe7AbwQx5GSbId+ijrMuC4r8BXHhEs92kXXvqkYR0VD1TcCzqkIrg4BocnVmtfgg==', CAST(N'2026-04-04T19:07:50.1109226+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-01T19:07:50.1108744+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (3, 3, N'TiADFrUc+wxRnCVvT6J4h3gRHmXzHx1uldq2wR9ytDxOglYRLba7tfzyuSb7r2uqPQjXo3EkKxE0f2VZUjHffQ==', CAST(N'2026-04-05T02:09:20.0700644+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:09:20.0691010+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (4, 23, N'5nAcKasXaejwiVka4oTT1XceIrgueIzV+3q/bjwwBi9eDmPCHwdIxTRxGe4kKj6WTshv9FIwMyKv2ixXdeN5Wg==', CAST(N'2026-04-05T02:12:24.9688125+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:12:24.9687968+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (5, 4, N'qRItnBwXn0/7GiFxaIPFL9K3xRPQGX2HIAgceYwaNpAbiNGHSiG9vLjYtCwXd7chD9qQFRqQehtPZJO1uP3Q8g==', CAST(N'2026-04-05T02:13:56.8489220+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:13:56.8489148+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (6, 4, N'xYzxXkC5eBWemyPjKhGQlOqVJN2oyxjXx3w07UQNVq/Eo8QNjMxx+Fy00DbUq1sOZtTFrYD8W83hICrOoW6zmQ==', CAST(N'2026-04-05T02:15:07.1192773+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:15:07.1192324+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (7, 1, N'UoZFSMh/NdPDL+3H0ozt8YQTXPsNQMRRfGmjDDsa4dreKTFHEFbsSmYB+WzO9N2EPZI3GqQ4sQS4I5ikfAQAMQ==', CAST(N'2026-04-05T02:19:41.1874757+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:19:41.1874642+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (8, 2, N'3iurH5Q3e1n5gP2u7wz9Z3Bz9CjjjuPGk9HvNAEOLxU6EEs2OG+5EJorsP6t2pPUOaKoY5blpO+3N+AhYPH9kA==', CAST(N'2026-04-05T02:20:02.6513303+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:20:02.6513217+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (9, 3, N'z2403/B9bvaT42pDutMJa8DzfB+v8AeHT0VCJrpGMPCTFHlDw9MVNnualhLgPGC6arAQOde6ihnn2rKFAQfmbg==', CAST(N'2026-04-05T02:20:16.0288443+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:20:16.0288278+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (10, 4, N'X9EMGMu33eGjuvhr04v0jEFZ90PKQQi3rOyBG0cKyYx0FpWSwSTAKRXIcIsoiHZbym11hUDbxMUMgN/pxtKjOA==', CAST(N'2026-04-05T02:20:36.6631770+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:20:36.6631567+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (11, 7, N'ea6LTsraUa6DpHVEoyvZKeHC/ve1KIT28WVTmkmIXYPWYa7ZpPCPjeyHwCQ/pNPtJLUfC3OKAkcLpR0n0ORbfA==', CAST(N'2026-04-05T02:20:50.9760516+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:20:50.9760287+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (12, 4, N'WYSV/3PXp+R/o3QFwg1AkgLxjj7pQSf70Bl+3t5L0JNIKED0bpr/AHo7qDRfQbW+Q6KAVmRAxCNmMCXk+IqAQg==', CAST(N'2026-04-05T02:21:27.9142291+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:21:27.9142066+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (13, 1, N'aquy3eVs0yGJCJIuMt7PhV1/EbKNrHCC18TOyLIOhvZORnUIwE3Mh6B9YgPu0okRTnkz0MszgTCn3dcTL/i2AA==', CAST(N'2026-04-05T02:27:49.4232624+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:27:49.4232503+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (14, 1, N'iRL7pFJuUj85bFlALgOfSk/RraFy62ovQ1he3GXocAGyANXXV74uLxdHwLpYO3J0C5goiLpchXckYgKa3cEvZw==', CAST(N'2026-04-05T02:32:29.2153284+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:32:29.2153126+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (15, 3, N'FlnYW5ccod5OkI5vtAZEfP/2r7E82zu/NUtOa7vCq/I41gL9jOpOEM8tENG0OFQob6l803QMA5OVynejWhXvcg==', CAST(N'2026-04-05T02:40:12.7638162+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:40:12.7637618+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (16, 1, N'qXIu751HjHqQpLWZeyrq2x6Fx1k6Zjq2rJeHG3YTlVK38C1Cy5CLzCrRkfsK1vKR6MloDRSPTvBj797OpLC6Ug==', CAST(N'2026-04-05T02:44:47.5321268+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:44:47.5320877+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (18, 2, N'Rrc680GrD0K1Ug4XHNFMQllOpODYnVd5987h/DQisECPFOwjvafoERGVejU17kDoneBAncpI9gx6iPvfyqwy8Q==', CAST(N'2026-04-05T02:49:23.3721868+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T02:49:23.3721450+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (19, 3, N'V6iIANLOX+oj5fLXVdkwPd6gtIlXuoF7IfzCbQUtRgiAffju6dsPS8oJTs/69Q6p2Av4wLm39O4vou0ElGLIWg==', CAST(N'2026-04-05T03:36:50.8159595+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T03:36:50.8157975+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (20, 5, N'CDMmKIRB4mIJZhZhsEc1VF9/53NhYdBiVxPoh3cX9IJByDUKt8ZhkjDqQd1OXGMttc+jkePzctE4NFbpgLNGXg==', CAST(N'2026-04-05T04:10:38.6966504+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T04:10:38.6966406+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (21, 3, N'WwI5l8qz0EELg9jpIe9ZVon8KdnVRgJMvr1ZQ9GgJWG4dNtLFXRoLt37qjTBaHcsDqtYQoZbk0pNadrGRubp7w==', CAST(N'2026-04-05T04:11:41.1007997+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T04:11:41.1007915+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (22, 5, N'9520b1cjlN1U8f4ijIfyGWWyilaU0PbGYvDSzxPpNLa1ybbIrs9Ko09iQthNFQSLn9mMVCuZKdKMkc6GtS2nuw==', CAST(N'2026-04-05T04:30:37.5341596+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T04:30:37.5341489+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1002, 5, N'6SNYj6SN8o0jru+y1yYLzsiTVJ7V8am4aVdFI+q5tp9BJInU4E3wpjzMgpj3sjMj4FJ0BjJ3rELDZTtTcuKkGg==', CAST(N'2026-04-05T15:40:46.5933999+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T15:40:46.5924645+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1003, 2, N'uWIogW9ZXApTVIwv+lETxDtPQd6homfzp+O22+EY/x6vvS7YIDMDFHE7p/rglV/1vQih0SYfX2M0QxfjKtN+Fg==', CAST(N'2026-04-05T15:40:51.0636195+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T15:40:51.0635871+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1004, 3, N'T43GNOSFaiHQtQYf6aTHdDwFU4M0sD27FfXdwQKDs7SI5fsi+QHkMr6Njab4LBb+fmaVPcvOaQwwpXyn1Q91EA==', CAST(N'2026-04-05T15:47:04.3480740+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T15:47:04.3480647+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1005, 2, N'yFmHCp5uqof3B65aMB8CaqPV5B+8fmwIQpgD4RUHy85kuXAaxnSow3ppukU52WI7uNEPFS781m7sJ0Vg8NIijA==', CAST(N'2026-04-05T16:51:58.8393086+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T16:51:58.8384737+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1006, 7, N'w1BQNwPX+TSW2eMI+bF5XH1/VH9t/1tbT9Razrg/4Qvb7/T/yS0uC80s0viUww5ZGb+toy9T+9JRbTzL568icA==', CAST(N'2026-04-05T16:55:51.2099598+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T16:55:51.2089157+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1007, 4, N'xoAc4ip+vBNR0jkfJbrw/YcIh/mnv5FKtjL8GCY8MUejZNbklozfqqFWF6mmINURf2DOJgcWvuThIo3uJOpG2g==', CAST(N'2026-04-05T16:57:12.1032000+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T16:57:12.1031811+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1008, 7, N'MzunJW16JGMK3/hv16qtfdosC/WGBK16DiIThYjGVM8TiPLzgwWrWMJwJRnCcjygTTSrc0cmhuOotMcmz1BOhQ==', CAST(N'2026-04-05T17:07:34.0742559+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:07:34.0742485+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1009, 12, N'kKiUI0pa55Ox5esIbhhoPb/616mD/g9LgeWxNVvo+aPEsgnkD3VjfGLWJzRrkf/GnS9TqLC+jOwHsiqzF0RnZA==', CAST(N'2026-04-05T17:08:47.9317849+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:08:47.9317734+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1010, 2, N'dMkKHqRz4sFAPUoYf2TikmIFXPrOgijAlJ0h7vymSy/gKX9Y85lgtDLLWadoojWxsU+Oz1LGJ3Oivwk87TPiVg==', CAST(N'2026-04-05T17:09:42.0627598+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:09:42.0627449+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1011, 11, N'odRfl469Lu5kwUsF0cFAlKkq+agwDtI1Ax+/lfyOjpsO76GmbdwxtLxgIeM+WiSWy11euL8J4Ux0KFpJ1eAk1g==', CAST(N'2026-04-05T17:10:17.3138517+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:10:17.3138451+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1012, 2, N'3jd9ii9CWwHk2tUjpqt4kWpM+K2yAoWxwlKAvC1QkERPIM5Olx0fhAtT7NsNVuakfeYTo4g6A5OWMX+Rczc1Og==', CAST(N'2026-04-05T17:13:37.4443323+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:13:37.4443121+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1013, 4, N'Sr8TH6w5NRpr6eMEEa4+VZ/rc0HvVFvHWps0jZxVBrsVt+yzVdKbQSMaYBf8W0UxmGtLjz7EL+ueZ1cElU4b2A==', CAST(N'2026-04-05T17:14:23.4340276+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:14:23.4340204+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1014, 3, N'FaUYjb8FW3O9PzXeZG+bVf3mjQK5h8fYSOGzfGXKCWOhE7gTCKxMCmwwkffh3XC4vh2XEhoxjiMwnKO0N9CF+w==', CAST(N'2026-04-05T17:23:08.6745304+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T17:23:08.6745221+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1015, 4, N'+xcApBNOKlNUEg83+E78xy9GiUuMtwucecyo7zNmX18k18WbNnzpnZA0nxqEtJz+Ayx7Q9YB4oJ6Gd01p+bq9A==', CAST(N'2026-04-05T18:11:37.3246107+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-02T18:11:37.3235749+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1016, 4, N'oSxOU8z+i1n4p2VPB2ja9mn9otaXrL0519iD2Pp5E3f13ZgZZomMU9KscyNJSw7TlF7IFGOkAv6CFHUgD2yEwQ==', CAST(N'2026-04-06T14:07:08.1194895+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-03T14:07:08.1184120+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1017, 1, N'0EoWmwSCGydHXqZqBmmwuOF1ySMG6QnuKmPsb8xkXlbbPXQ8mi7/DwXTuQIcRff1OUZPbN0D383kcjANmqo26A==', CAST(N'2026-04-06T14:21:24.8833819+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-03T14:21:24.8833663+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1018, 2, N'ZGWTwpdbKF8etNQd+Dc2o2TJIpOiJOnwWEwgF1vCF4VWaXhoojcdKimZCCZfkobBIusuN5T9THh8c5REie+ReA==', CAST(N'2026-04-06T14:44:52.5601830+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-03T14:44:52.5593639+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1019, 3, N'w6yB1lFHdU5hAR6FCUP0fZ5Looiy6/EoXkEMawNuKGXzy+820GesvrahZ0FJQsMBRMZDb+ooK18MTBIA6GlmQA==', CAST(N'2026-04-06T15:00:06.5393772+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-03T15:00:06.5393544+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1020, 5, N'NAXEsAR+hzAkfHkGGAU1cSN3nIDvHBeyZ8ns6R1rH0rU9pkAEuglrxZE109aliqCoaUtSmXrbOvUXLYUensrqw==', CAST(N'2026-04-06T15:01:36.3325177+00:00' AS DateTimeOffset), 1, CAST(N'2026-04-03T15:01:36.3325063+00:00' AS DateTimeOffset))
INSERT [dbo].[RefreshTokens] ([Id], [UserId], [Token], [ExpiresAt], [IsRevoked], [CreatedAt]) VALUES (1021, 3, N'Dqtl8y5Xl+dsOxjMNASkWQCziv0Jo8Mwck3OWk+xjf5CF9fzMCvzRybo0xRrOaco9JTz77Lm6Y2svMx8TjtE6A==', CAST(N'2026-04-06T15:02:09.8583746+00:00' AS DateTimeOffset), 0, CAST(N'2026-04-03T15:02:09.8583493+00:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[RefreshTokens] OFF
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
-- Removed Sale 7 (ExhibitionSubmission 11 - Ongoing competition)
-- Removed Sale 8 (ExhibitionSubmission 15 - removed)
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (1001, 5, 1, CAST(2509000.00 AS Decimal(18, 2)), CAST(N'2026-04-02T16:56:15.907' AS DateTime))
INSERT [dbo].[Sales] ([Id], [ExhibitionSubmissionId], [CustomerId], [SoldPrice], [SoldDate]) VALUES (1002, 7, 1, CAST(1600000.00 AS Decimal(18, 2)), CAST(N'2026-04-02T17:07:59.217' AS DateTime))
-- Removed Sale 1003 (ExhibitionSubmission 12 - Ongoing competition)
-- Removed Sale 1004 (ExhibitionSubmission 10 - Ongoing competition)
SET IDENTITY_INSERT [dbo].[Sales] OFF
GO
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (2, CAST(N'2020-01-15' AS Date), N'Administration', N'Manager')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (3, CAST(N'2021-06-01' AS Date), N'Fine Arts', N'Evaluator')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (9, CAST(N'2021-09-20' AS Date), N'Art & Design', N'Innovative teaching methods')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (10, CAST(N'2022-10-25' AS Date), N'Art & Design', N'Passionate about art education')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (16, CAST(N'2020-05-10' AS Date), N'Painting & Illustration', N'Expert in traditional painting techniques')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (17, CAST(N'2021-03-15' AS Date), N'Digital Art & Animation', N'Specializes in modern digital techniques')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (18, CAST(N'2019-08-20' AS Date), N'Sculpture & 3D Art', N'Award-winning sculptor')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (19, CAST(N'2022-01-10' AS Date), N'Photography & Visual Arts', N'Professional photographer with 15 years experience')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (20, CAST(N'2020-11-05' AS Date), N'Mixed Media & Contemporary Art', N'Experimental art specialist')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (21, CAST(N'2021-06-18' AS Date), N'Art History & Theory', N'PhD in Art History')
INSERT [dbo].[Staffs] ([UserId], [DateJoined], [SubjectHandled], [Remarks]) VALUES (22, CAST(N'2022-09-01' AS Date), N'Graphic Design & Typography', N'Former creative director at major design agency')
GO
SET IDENTITY_INSERT [dbo].[StudentAwards] ON 

INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate], [CompetitionAwardId]) VALUES (2, 3, 1, 1, CAST(N'2025-09-01' AS Date), 3)
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate], [CompetitionAwardId]) VALUES (1021, 17, NULL, 3, CAST(N'2026-04-03' AS Date), 7)
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate], [CompetitionAwardId]) VALUES (1022, 12, NULL, 3, CAST(N'2026-04-03' AS Date), 4)
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate], [CompetitionAwardId]) VALUES (1024, 14, NULL, 3, CAST(N'2026-04-03' AS Date), 5)
INSERT [dbo].[StudentAwards] ([Id], [SubmissionId], [AwardId], [AwardedBy], [AwardedDate], [CompetitionAwardId]) VALUES (1025, 16, NULL, 3, CAST(N'2026-04-03' AS Date), 6)
SET IDENTITY_INSERT [dbo].[StudentAwards] OFF
GO
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (4, N'STU-2024-001', CAST(N'2024-09-01' AS Date), CAST(N'2005-03-15' AS Date), N'123 Art Street, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (5, N'STU-2024-002', CAST(N'2024-09-01' AS Date), CAST(N'2005-07-22' AS Date), N'456 Palette Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (6, N'STU-2024-003', CAST(N'2024-09-01' AS Date), CAST(N'2005-11-08' AS Date), N'789 Canvas Blvd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (11, N'STU-2024-004', CAST(N'2024-09-01' AS Date), CAST(N'2005-05-10' AS Date), N'321 Sculpture Lane, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (12, N'STU-2024-005', CAST(N'2024-09-01' AS Date), CAST(N'2005-08-19' AS Date), N'654 Mixed Media Rd, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (13, N'STU-2024-006', CAST(N'2024-09-01' AS Date), CAST(N'2005-02-27' AS Date), N'987 Digital Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (23, N'STU-2023-007', CAST(N'2023-09-01' AS Date), CAST(N'2006-04-12' AS Date), N'101 Watercolor Way, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (24, N'STU-2023-008', CAST(N'2023-09-01' AS Date), CAST(N'2006-08-25' AS Date), N'202 Illustration Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (25, N'STU-2023-009', CAST(N'2023-09-01' AS Date), CAST(N'2006-01-30' AS Date), N'303 Portrait Blvd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (26, N'STU-2023-010', CAST(N'2023-09-01' AS Date), CAST(N'2006-06-14' AS Date), N'404 Perspective Ln, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (27, N'STU-2023-011', CAST(N'2023-09-01' AS Date), CAST(N'2006-09-03' AS Date), N'505 Mixed Media Rd, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (28, N'STU-2024-007', CAST(N'2024-09-01' AS Date), CAST(N'2007-02-18' AS Date), N'606 Beginner St, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (29, N'STU-2024-008', CAST(N'2024-09-01' AS Date), CAST(N'2007-05-22' AS Date), N'707 Potential Ave, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (30, N'STU-2024-009', CAST(N'2024-09-01' AS Date), CAST(N'2007-07-11' AS Date), N'808 Innovation Blvd, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (31, N'STU-2024-010', CAST(N'2024-09-01' AS Date), CAST(N'2007-10-05' AS Date), N'909 Detail Ln, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (32, N'STU-2024-011', CAST(N'2024-09-01' AS Date), CAST(N'2007-12-20' AS Date), N'1010 Learner St, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (33, N'STU-2023-012', CAST(N'2023-09-01' AS Date), CAST(N'2006-03-08' AS Date), N'111 Abstract Way, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (34, N'STU-2023-013', CAST(N'2023-09-01' AS Date), CAST(N'2006-07-19' AS Date), N'222 Color Theory Rd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (35, N'STU-2023-014', CAST(N'2023-09-01' AS Date), CAST(N'2006-11-02' AS Date), N'333 Nature Art Ave, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (36, N'STU-2023-015', CAST(N'2023-09-01' AS Date), CAST(N'2006-04-27' AS Date), N'444 Architecture Blvd, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (37, N'STU-2023-016', CAST(N'2023-09-01' AS Date), CAST(N'2006-08-15' AS Date), N'555 Fashion Ln, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (38, N'STU-2022-001', CAST(N'2022-09-01' AS Date), CAST(N'2005-01-14' AS Date), N'666 Advanced St, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (39, N'STU-2022-002', CAST(N'2022-09-01' AS Date), CAST(N'2005-06-30' AS Date), N'777 Portfolio Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (40, N'STU-2022-003', CAST(N'2022-09-01' AS Date), CAST(N'2005-09-17' AS Date), N'888 College Blvd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (41, N'STU-2022-004', CAST(N'2022-09-01' AS Date), CAST(N'2005-12-04' AS Date), N'999 Fine Arts Ln, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (42, N'STU-2024-012', CAST(N'2024-09-01' AS Date), CAST(N'2007-03-21' AS Date), N'1111 Comic Art St, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (43, N'STU-2024-013', CAST(N'2024-09-01' AS Date), CAST(N'2007-08-09' AS Date), N'1212 Animal Art Ave, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (44, N'STU-2023-017', CAST(N'2023-09-01' AS Date), CAST(N'2006-02-16' AS Date), N'1313 Landscape Blvd, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (45, N'STU-2023-018', CAST(N'2023-09-01' AS Date), CAST(N'2006-05-28' AS Date), N'1414 Surrealism Ln, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (46, N'STU-2023-019', CAST(N'2023-09-01' AS Date), CAST(N'2006-10-13' AS Date), N'1515 Urban Art St, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (47, N'STU-2023-020', CAST(N'2023-09-01' AS Date), CAST(N'2006-12-01' AS Date), N'1616 Classical Ave, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (48, N'STU-2024-014', CAST(N'2024-09-01' AS Date), CAST(N'2007-04-07' AS Date), N'1717 Graffiti Blvd, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (49, N'STU-2024-015', CAST(N'2024-09-01' AS Date), CAST(N'2007-09-24' AS Date), N'1818 Botanical Ln, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (50, N'STU-2023-021', CAST(N'2023-09-01' AS Date), CAST(N'2006-01-11' AS Date), N'1919 Sci-Fi St, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (51, N'STU-2023-022', CAST(N'2023-09-01' AS Date), CAST(N'2006-06-06' AS Date), N'2020 Conceptual Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (52, N'STU-2022-005', CAST(N'2022-09-01' AS Date), CAST(N'2005-03-23' AS Date), N'2121 Exhibition Blvd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (53, N'STU-2022-006', CAST(N'2022-09-01' AS Date), CAST(N'2005-07-18' AS Date), N'2222 Award Winner Ln, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (54, N'STU-2023-023', CAST(N'2023-09-01' AS Date), CAST(N'2006-11-29' AS Date), N'2323 Printmaking St, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (55, N'STU-2023-024', CAST(N'2023-09-01' AS Date), CAST(N'2006-04-04' AS Date), N'2424 Calligraphy Ave, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (56, N'STU-2024-016', CAST(N'2024-09-01' AS Date), CAST(N'2007-01-16' AS Date), N'2525 Photography Blvd, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (57, N'STU-2024-017', CAST(N'2024-09-01' AS Date), CAST(N'2007-06-20' AS Date), N'2626 Textile Ln, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (58, N'STU-2023-025', CAST(N'2023-09-01' AS Date), CAST(N'2006-08-31' AS Date), N'2727 Minimalist St, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (59, N'STU-2023-026', CAST(N'2023-09-01' AS Date), CAST(N'2006-12-15' AS Date), N'2828 Impressionism Ave, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (60, N'STU-2022-007', CAST(N'2022-09-01' AS Date), CAST(N'2005-05-09' AS Date), N'2929 Muralist Blvd, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (61, N'STU-2022-008', CAST(N'2022-09-01' AS Date), CAST(N'2005-10-27' AS Date), N'3030 Installation Ln, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (62, N'STU-2023-027', CAST(N'2023-09-01' AS Date), CAST(N'2006-02-03' AS Date), N'3131 Video Art St, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (63, N'STU-2023-028', CAST(N'2023-09-01' AS Date), CAST(N'2006-07-22' AS Date), N'3232 Illustration Ave, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (64, N'STU-2024-018', CAST(N'2024-09-01' AS Date), CAST(N'2007-03-10' AS Date), N'3333 Manga Blvd, Art District')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (65, N'STU-2024-019', CAST(N'2024-09-01' AS Date), CAST(N'2007-08-28' AS Date), N'3434 Fantasy Ln, Creative City')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (66, N'STU-2022-009', CAST(N'2022-09-01' AS Date), CAST(N'2005-04-16' AS Date), N'3535 Scholarship St, Design Town')
INSERT [dbo].[Students] ([UserId], [AdmissionNumber], [AdmissionDate], [DateOfBirth], [Address]) VALUES (67, N'STU-2022-010', CAST(N'2022-09-01' AS Date), CAST(N'2005-11-05' AS Date), N'3636 Multidisciplinary Ave, Art District')
GO
SET IDENTITY_INSERT [dbo].[SubmissionReviews] ON 

INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (1, 1, 2, N'Best', N'Exceptional use of color and composition', N'Minor perspective issues in background', N'Consider adding more depth to the background elements', CAST(N'2026-04-02T03:25:50.5093148+00:00' AS DateTimeOffset))
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
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (24, 10, 3, N'Good', N'Vibrant colors, good energy', N'Composition needs work', N'Study rule of thirds', CAST(N'2026-03-16T00:00:00.0000000+00:00' AS DateTimeOffset))
INSERT [dbo].[SubmissionReviews] ([Id], [SubmissionId], [StaffId], [RatingLevel], [Strengths], [Weaknesses], [Improvements], [ReviewedAt]) VALUES (25, 11, 3, N'Best', N'Beautiful depiction of spring rain, excellent mood', N'Minor issues with foreground detail', N'Add more texture to foreground elements', CAST(N'2026-03-16T00:00:00.0000000+00:00' AS DateTimeOffset))
-- Removed review 23 for submission 93 (competition 21 is Ongoing)
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
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (32, 11, 23, N'Soul Mirror', N'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800', CAST(2500000.00 AS Decimal(18, 2)), CAST(N'2026-02-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'A contemplative self-portrait exploring inner emotions', N'The face is a picture of the mind', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (33, 11, 24, N'Grandmother''s Wisdom', N'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2026-02-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Portrait of my grandmother capturing years of experience', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (34, 11, 25, N'Young Dreamer', N'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', CAST(1800000.00 AS Decimal(18, 2)), CAST(N'2026-02-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Child portrait capturing innocence and wonder', NULL, N'Eyes that see the world anew, Dreams painted in morning dew')
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (35, 11, 26, N'The Artist', N'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2026-02-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Self-portrait as an artist at work', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (36, 11, 27, N'Cultural Heritage', N'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800', CAST(3000000.00 AS Decimal(18, 2)), CAST(N'2026-02-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Portrait celebrating my cultural identity', N'In every face, a story untold', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (37, 11, 28, N'Morning Light', N'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800', CAST(1700000.00 AS Decimal(18, 2)), CAST(N'2026-02-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Portrait study in natural morning light', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (38, 11, 29, N'The Musician', N'https://images.unsplash.com/photo-1577720643742-27ca8796477f?w=800', CAST(2300000.00 AS Decimal(18, 2)), CAST(N'2026-02-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Portrait of a jazz musician mid-performance', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (39, 11, 30, N'Silent Strength', N'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800', CAST(2800000.00 AS Decimal(18, 2)), CAST(N'2026-02-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Portrait emphasizing inner strength and resilience', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (40, 11, 31, N'Generations', N'https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2026-03-02T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Double portrait of mother and daughter', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (41, 11, 32, N'Digital Age', N'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800', CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2026-03-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Contemporary portrait in digital medium', N'Modern times, timeless faces', NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (42, 12, 33, N'Unity Form', N'https://images.unsplash.com/photo-1681235014294-588fea095706?w=800', CAST(3200000.00 AS Decimal(18, 2)), CAST(N'2026-02-01T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Abstract sculpture representing human connection', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (43, 12, 34, N'Metal Dreams', N'https://images.unsplash.com/photo-1647792845543-a8032c59cbdf?w=800', CAST(2700000.00 AS Decimal(18, 2)), CAST(N'2026-02-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Contemporary metal sculpture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (44, 12, 35, N'Organic Flow', N'https://images.unsplash.com/photo-1635141849017-c531949fb5b3?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2026-02-08T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Nature-inspired sculptural form', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (45, 12, 36, N'Geometric Balance', N'https://images.unsplash.com/photo-1702325597300-f3d68b5b9499?w=800', CAST(3500000.00 AS Decimal(18, 2)), CAST(N'2026-02-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Minimalist geometric sculpture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (46, 12, 37, N'Kinetic Energy', N'https://images.unsplash.com/photo-1761156254622-7b66649b1f69?w=800', CAST(2900000.00 AS Decimal(18, 2)), CAST(N'2026-02-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Moving sculpture with kinetic elements', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (47, 12, 38, N'Stone Symphony', N'https://images.unsplash.com/photo-1658828570744-49dbc43a95cb?w=800', CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2026-02-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Carved stone sculpture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (48, 12, 39, N'Found Object Art', N'https://images.unsplash.com/photo-1681239063386-fc4a373c927b?w=800', CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2026-02-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Assemblage of recycled materials', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (49, 12, 40, N'Digital Fabrication', N'https://images.unsplash.com/photo-1614900157270-a0c14fadaeaa?w=800', CAST(4200000.00 AS Decimal(18, 2)), CAST(N'2026-02-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'3D printed contemporary sculpture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (50, 12, 41, N'Light and Shadow', N'https://images.unsplash.com/photo-1765813397355-22b8ebc65b65?w=800', CAST(2600000.00 AS Decimal(18, 2)), CAST(N'2026-02-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Sculpture designed for light interaction', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (51, 12, 42, N'Human Form Study', N'https://images.unsplash.com/photo-1701958213864-2307a737e853?w=800', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2026-03-02T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Contemporary figurative sculpture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (52, 16, 43, N'Golden Harvest', N'https://images.unsplash.com/photo-1715532176260-78302f560fa6?w=800', CAST(2800000.00 AS Decimal(18, 2)), CAST(N'2025-09-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Autumn harvest celebration', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (53, 16, 44, N'Falling Leaves', N'https://images.unsplash.com/photo-1684410008411-6ccac995726d?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2025-09-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Leaves drifting in autumn breeze', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (54, 16, 45, N'Pumpkin Patch', N'https://images.unsplash.com/photo-1703593693038-3a326e089c86?w=800', CAST(1800000.00 AS Decimal(18, 2)), CAST(N'2025-09-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Vibrant pumpkin field in autumn', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (55, 16, 46, N'Misty Morning', N'https://images.unsplash.com/photo-1712255829950-4222c2f7073c?w=800', CAST(3200000.00 AS Decimal(18, 2)), CAST(N'2025-09-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Autumn fog over landscape', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (56, 16, 47, N'Forest Path Autumn', N'https://images.unsplash.com/photo-1654613001582-155f7c3a1f77?w=800', CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2025-09-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Woodland trail in autumn', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (57, 16, 48, N'Autumn Reflection', N'https://images.unsplash.com/photo-1657584905470-ac4ef76ee2b4?w=800', CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2025-10-01T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Trees reflected in still water', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (58, 16, 49, N'Rustic Barn', N'https://images.unsplash.com/photo-1654865433650-23e71f161b64?w=800', CAST(1700000.00 AS Decimal(18, 2)), CAST(N'2025-10-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Old barn in autumn setting', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (59, 16, 50, N'Wildlife in Autumn', N'https://images.unsplash.com/photo-1628522994788-53bc1b1502c5?w=800', CAST(3500000.00 AS Decimal(18, 2)), CAST(N'2025-10-08T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Deer in autumn landscape', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (60, 16, 51, N'Harvest Moon', N'https://images.unsplash.com/photo-1741038273303-087bba191d55?w=800', CAST(2600000.00 AS Decimal(18, 2)), CAST(N'2025-10-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Full moon over autumn field', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (61, 16, 52, N'Autumn Still Life', N'https://images.unsplash.com/photo-1696937059409-60900a43bc67?w=800', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2025-10-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Arrangement of autumn elements', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (62, 17, 53, N'The Wanderer', N'https://images.unsplash.com/photo-1610621062045-ef5f7201bb3f?w=800', CAST(3800000.00 AS Decimal(18, 2)), CAST(N'2025-10-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Fantasy character with mystical powers', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (63, 17, 54, N'Cyber Ninja', N'https://images.unsplash.com/photo-1741335661490-b47ca09547ae?w=800', CAST(2900000.00 AS Decimal(18, 2)), CAST(N'2025-10-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Futuristic ninja character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (64, 17, 55, N'Forest Spirit', N'https://images.unsplash.com/photo-1763064394681-58263c82293f?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2025-10-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Nature-based character design', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (65, 17, 56, N'Space Explorer', N'https://images.unsplash.com/photo-1756493620874-e031b0c16dd4?w=800', CAST(3400000.00 AS Decimal(18, 2)), CAST(N'2025-10-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Sci-fi astronaut character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (66, 17, 57, N'Urban Hero', N'https://images.unsplash.com/photo-1768320521546-be1917266ad4?w=800', CAST(2600000.00 AS Decimal(18, 2)), CAST(N'2025-11-01T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Modern superhero design', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (67, 17, 58, N'Ancient Warrior', N'https://images.unsplash.com/photo-1682024765261-d2ccf4a1e21c?w=800', CAST(2300000.00 AS Decimal(18, 2)), CAST(N'2025-11-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Historical warrior character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (68, 17, 59, N'Magical Girl', N'https://images.unsplash.com/photo-1705581147348-ca43430d6aa4?w=800', CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2025-11-08T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Anime-style magical character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (69, 17, 60, N'Robot Companion', N'https://images.unsplash.com/photo-1719500496449-45401c017f59?w=800', CAST(3600000.00 AS Decimal(18, 2)), CAST(N'2025-11-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Friendly robot character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (70, 17, 61, N'Fantasy Merchant', N'https://images.unsplash.com/photo-1744126419558-5b7624a670d2?w=800', CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2025-11-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'RPG merchant character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (71, 17, 62, N'Ocean Guardian', N'https://images.unsplash.com/photo-1763615445633-c05153e7d1a7?w=800', CAST(2700000.00 AS Decimal(18, 2)), CAST(N'2025-11-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Underwater protector character', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (72, 18, 63, N'Gothic Cathedral Study', N'https://images.unsplash.com/photo-1773218373348-34db6bb11662?w=800', CAST(4500000.00 AS Decimal(18, 2)), CAST(N'2026-03-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Detailed cathedral architecture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (73, 18, 64, N'Modern Skyline', N'https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?w=800', CAST(3200000.00 AS Decimal(18, 2)), CAST(N'2026-03-08T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Contemporary city architecture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (74, 18, 65, N'Bridge Structure', N'https://images.unsplash.com/photo-1761386001767-4bc6f2648077?w=800', CAST(2700000.00 AS Decimal(18, 2)), CAST(N'2026-03-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Engineering and art combined', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (75, 18, 66, N'Futuristic Tower', N'https://images.unsplash.com/photo-1631237478031-86a4afcf62b4?w=800', CAST(5000000.00 AS Decimal(18, 2)), CAST(N'2026-03-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Imagined future architecture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (76, 18, 67, N'Historic Mansion', N'https://images.unsplash.com/photo-1580493113011-ad79f792a7c2?w=800', CAST(3800000.00 AS Decimal(18, 2)), CAST(N'2026-03-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Victorian era architecture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (77, 18, 23, N'Temple Architecture', N'https://images.unsplash.com/photo-1641678422313-efdcc0416b36?w=800', CAST(2900000.00 AS Decimal(18, 2)), CAST(N'2026-03-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Asian temple structure', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (78, 18, 24, N'Industrial Beauty', N'https://images.unsplash.com/photo-1633081528845-1c0b71d8a010?w=800', CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2026-03-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Factory and warehouse art', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (79, 18, 25, N'Eco Architecture', N'https://images.unsplash.com/photo-1773432661163-351c473345e5?w=800', CAST(4200000.00 AS Decimal(18, 2)), CAST(N'2026-03-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Green building concept', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (80, 18, 26, N'Minimalist Pavilion', N'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800', CAST(3100000.00 AS Decimal(18, 2)), CAST(N'2026-03-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Modern minimalist structure', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (81, 18, 27, N'Underwater City', N'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800', CAST(2600000.00 AS Decimal(18, 2)), CAST(N'2026-03-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Speculative aquatic architecture', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (82, 20, 28, N'Contrast Study', N'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', CAST(3000000.00 AS Decimal(18, 2)), CAST(N'2025-11-05T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'High contrast monochrome artwork', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (83, 20, 29, N'Portrait in Shadows', N'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', CAST(2500000.00 AS Decimal(18, 2)), CAST(N'2025-11-08T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Chiaroscuro portrait technique', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (84, 20, 30, N'Urban Geometry BW', N'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800', CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2025-11-10T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Geometric city composition in monochrome', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (85, 20, 31, N'Nature Forms BW', N'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800', CAST(3400000.00 AS Decimal(18, 2)), CAST(N'2025-11-12T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Organic shapes in monochrome', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (86, 20, 32, N'Abstract Composition BW', N'https://images.unsplash.com/photo-1577720643742-27ca8796477f?w=800', CAST(2200000.00 AS Decimal(18, 2)), CAST(N'2025-11-15T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Non-representational black and white', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (87, 20, 33, N'Still Life Study BW', N'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800', CAST(1900000.00 AS Decimal(18, 2)), CAST(N'2025-11-18T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Classical still life in grayscale', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (88, 20, 34, N'Dramatic Landscape BW', N'https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800', CAST(2700000.00 AS Decimal(18, 2)), CAST(N'2025-11-20T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Stormy monochrome landscape', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (89, 20, 35, N'Texture Exploration', N'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800', CAST(3200000.00 AS Decimal(18, 2)), CAST(N'2025-11-22T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Focus on surface textures in monochrome', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (90, 20, 36, N'Figure Study BW', N'https://images.unsplash.com/photo-1681235014294-588fea095706?w=800', CAST(2400000.00 AS Decimal(18, 2)), CAST(N'2025-11-25T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Human form in monochrome', NULL, NULL)
INSERT [dbo].[Submissions] ([Id], [CompetitionId], [StudentId], [Title], [WorkUrl], [ProposedPrice], [SubmittedAt], [FileName], [Description], [Quotation], [Poem]) VALUES (91, 20, 37, N'Minimalist Expression', N'https://images.unsplash.com/photo-1647792845543-a8032c59cbdf?w=800', CAST(2100000.00 AS Decimal(18, 2)), CAST(N'2025-11-28T00:00:00.0000000+00:00' AS DateTimeOffset), NULL, N'Minimal marks, maximum impact', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Submissions] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (1, N'admin', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Admin User', N'admin@ifa.edu', NULL, 1, 1, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (2, N'manager', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Manager User', N'manager@ifa.edu', NULL, 1, 2, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=manager')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (3, N'staff', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Staff Member', N'staff@ifa.edu', N'555-0103', 1, 3, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=staff')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (4, N'alice', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Alice Johnson', N'alice@student.ifa.edu', N'555-0104', 1, 4, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=alice')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (5, N'bob', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Bob Smith', N'bob@student.ifa.edu', N'555-0105', 1, 4, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=bob')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (6, N'carol', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Carol White', N'carol@student.ifa.edu', N'555-0106', 1, 4, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=carol')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (7, N'customer1', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Customer One', N'customer1@example.com', NULL, 1, 5, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=customer1')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (8, N'customer2', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Customer Two', N'customer2@example.com', NULL, 1, 5, CAST(N'2026-03-22T22:57:13.8646446+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=customer2')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (9, N'staff2', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Robert Brown', N'teacher2@artschool.com', N'555-0102', 1, 3, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=robert')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (10, N'staff3', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Lisa Anderson', N'teacher3@artschool.com', N'555-0103', 1, 3, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (11, N'diana', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Diana Martinez', N'diana@student.ifa.edu', N'555-0204', 1, 4, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=diana')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (12, N'emma', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Emma Wilson', N'emma@student.ifa.edu', N'555-0205', 1, 4, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=emma')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (13, N'charlie', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Charlie Chen', N'charlie@student.ifa.edu', N'555-0203', 1, 4, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (14, N'michael', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Michael Brown', N'customer1@gmail.com', N'555-1001', 1, 5, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=michael')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (15, N'jessica', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Jessica Taylor', N'customer2@gmail.com', N'555-1002', 1, 5, CAST(N'2026-03-23T11:40:26.5680139+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (16, N'staff4', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'James Wilson', N'teacher4@artschool.com', N'555-0104', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=james')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (17, N'staff5', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Maria Garcia', N'teacher5@artschool.com', N'555-0105', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=maria')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (18, N'staff6', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'David Lee', N'teacher6@artschool.com', N'555-0106', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=david')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (19, N'staff7', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Jennifer Martinez', N'teacher7@artschool.com', N'555-0107', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (20, N'staff8', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Michael Thompson', N'teacher8@artschool.com', N'555-0108', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=mthompson')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (21, N'staff9', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Sarah Davis', N'teacher9@artschool.com', N'555-0109', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=sdavis')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (22, N'staff10', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Christopher Moore', N'teacher10@artschool.com', N'555-0110', 1, 3, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=cmoore')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (23, N'student6', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Olivia Brown', N'olivia.brown@student.com', N'555-0206', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (24, N'student7', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Noah Davis', N'noah.davis@student.com', N'555-0207', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=noah')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (25, N'student8', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Sophia Miller', N'sophia.miller@student.com', N'555-0208', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (26, N'student9', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Liam Garcia', N'liam.garcia@student.com', N'555-0209', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=liam')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (27, N'student10', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Ava Rodriguez', N'ava.rodriguez@student.com', N'555-0210', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=ava')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (28, N'student11', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Ethan Martinez', N'ethan.martinez@student.com', N'555-0211', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (29, N'student12', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Isabella Hernandez', N'isabella.hernandez@student.com', N'555-0212', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (30, N'student13', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Mason Lopez', N'mason.lopez@student.com', N'555-0213', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=mason')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (31, N'student14', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Mia Gonzalez', N'mia.gonzalez@student.com', N'555-0214', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=mia')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (32, N'student15', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Lucas Wilson', N'lucas.wilson@student.com', N'555-0215', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (33, N'student16', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Amelia Anderson', N'amelia.anderson@student.com', N'555-0216', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=amelia')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (34, N'student17', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Oliver Thomas', N'oliver.thomas@student.com', N'555-0217', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=oliver')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (35, N'student18', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Charlotte Taylor', N'charlotte.taylor@student.com', N'555-0218', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=charlotte')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (36, N'student19', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'James Moore', N'james.moore@student.com', N'555-0219', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=jmoore')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (37, N'student20', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Harper Jackson', N'harper.jackson@student.com', N'555-0220', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=harper')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (38, N'student21', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Benjamin Martin', N'benjamin.martin@student.com', N'555-0221', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=benjamin')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (39, N'student22', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Evelyn Lee', N'evelyn.lee@student.com', N'555-0222', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=evelyn')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (40, N'student23', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Elijah Perez', N'elijah.perez@student.com', N'555-0223', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=elijah')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (41, N'student24', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Abigail White', N'abigail.white@student.com', N'555-0224', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=abigail')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (42, N'student25', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'William Harris', N'william.harris@student.com', N'555-0225', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=william')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (43, N'student26', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Ella Sanchez', N'ella.sanchez@student.com', N'555-0226', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=ella')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (44, N'student27', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Alexander Clark', N'alexander.clark@student.com', N'555-0227', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=alexander')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (45, N'student28', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Emily Ramirez', N'emily.ramirez@student.com', N'555-0228', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=emilyR')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (46, N'student29', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Michael Lewis', N'michael.lewis@student.com', N'555-0229', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=mlewis')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (47, N'student30', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Elizabeth Robinson', N'elizabeth.robinson@student.com', N'555-0230', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (48, N'student31', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Daniel Walker', N'daniel.walker@student.com', N'555-0231', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (49, N'student32', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Sofia Young', N'sofia.young@student.com', N'555-0232', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (50, N'student33', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Matthew Allen', N'matthew.allen@student.com', N'555-0233', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=matthew')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (51, N'student34', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Avery King', N'avery.king@student.com', N'555-0234', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=avery')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (52, N'student35', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Henry Wright', N'henry.wright@student.com', N'555-0235', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=henry')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (53, N'student36', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Scarlett Scott', N'scarlett.scott@student.com', N'555-0236', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=scarlett')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (54, N'student37', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Joseph Torres', N'joseph.torres@student.com', N'555-0237', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=joseph')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (55, N'student38', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Grace Nguyen', N'grace.nguyen@student.com', N'555-0238', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=grace')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (56, N'student39', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Samuel Hill', N'samuel.hill@student.com', N'555-0239', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=samuel')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (57, N'student40', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Chloe Flores', N'chloe.flores@student.com', N'555-0240', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (58, N'student41', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'David Green', N'david.green@student.com', N'555-0241', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=dgreen')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (59, N'student42', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Victoria Adams', N'victoria.adams@student.com', N'555-0242', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=victoria')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (60, N'student43', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Jackson Nelson', N'jackson.nelson@student.com', N'555-0243', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=jackson')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (61, N'student44', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Zoey Baker', N'zoey.baker@student.com', N'555-0244', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=zoey')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (62, N'student45', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Sebastian Hall', N'sebastian.hall@student.com', N'555-0245', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=sebastian')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (63, N'student46', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Lily Rivera', N'lily.rivera@student.com', N'555-0246', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=lily')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (64, N'student47', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Jack Campbell', N'jack.campbell@student.com', N'555-0247', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=jack')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (65, N'student48', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Hannah Mitchell', N'hannah.mitchell@student.com', N'555-0248', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=hannah')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (66, N'student49', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Owen Carter', N'owen.carter@student.com', N'555-0249', 1, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=owen')
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Phone], [IsActive], [RoleId], [CreatedAt], [AvatarUrl]) VALUES (67, N'student50', N'$2a$11$fkihRHwv3fGpSNz20koSd.LJlxY8sb0fowYStiJhWyfcKlNHIuGUy', N'Layla Roberts', N'layla.roberts@student.com', N'555-0250', 0, 4, CAST(N'2026-03-23T00:00:00.0000000+07:00' AS DateTimeOffset), N'https://api.dicebear.com/7.x/avataaars/svg?seed=layla')
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
/****** Object:  Index [UQ_CompetitionCriteria]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[CompetitionCriteria] ADD  CONSTRAINT [UQ_CompetitionCriteria] UNIQUE NONCLUSTERED 
(
	[CompetitionId] ASC,
	[CriteriaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Criteria__D27358E522D3B16E]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[Criteria] ADD UNIQUE NONCLUSTERED 
(
	[CriteriaCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Customer__1788CC4DAD18D7C6]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[Customers] ADD UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_ReviewCriteria]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[GradeDetails] ADD  CONSTRAINT [UQ_ReviewCriteria] UNIQUE NONCLUSTERED 
(
	[ReviewId] ASC,
	[CriteriaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Notifications_UserId_IsRead]    Script Date: 03/04/2026 11:03:38 CH ******/
CREATE NONCLUSTERED INDEX [IX_Notifications_UserId_IsRead] ON [dbo].[Notifications]
(
	[UserId] ASC,
	[IsRead] ASC,
	[CreatedAt] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Roles__8A2B6160A0297D87]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Students__B468CC97990BFC84]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[Students] ADD UNIQUE NONCLUSTERED 
(
	[AdmissionNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Submissi__449EE12482AED411]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[SubmissionReviews] ADD UNIQUE NONCLUSTERED 
(
	[SubmissionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__536C85E430BBB199]    Script Date: 03/04/2026 11:03:38 CH ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Competitions] ADD  DEFAULT ('Upcoming') FOR [Status]
GO
ALTER TABLE [dbo].[Competitions] ADD  DEFAULT ((0)) FOR [IsDeleted]
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
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT ((0)) FOR [IsRevoked]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT (sysdatetimeoffset()) FOR [CreatedAt]
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
ALTER TABLE [dbo].[CompetitionAwards]  WITH CHECK ADD  CONSTRAINT [FK_CompetitionAwards_Awards] FOREIGN KEY([AwardId])
REFERENCES [dbo].[Awards] ([Id])
GO
ALTER TABLE [dbo].[CompetitionAwards] CHECK CONSTRAINT [FK_CompetitionAwards_Awards]
GO
ALTER TABLE [dbo].[CompetitionAwards]  WITH CHECK ADD  CONSTRAINT [FK_CompetitionAwards_Competitions] FOREIGN KEY([CompetitionId])
REFERENCES [dbo].[Competitions] ([Id])
GO
ALTER TABLE [dbo].[CompetitionAwards] CHECK CONSTRAINT [FK_CompetitionAwards_Competitions]
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
ALTER TABLE [dbo].[RefreshTokens]  WITH CHECK ADD  CONSTRAINT [FK_RefreshTokens_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[RefreshTokens] CHECK CONSTRAINT [FK_RefreshTokens_Users]
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
ALTER TABLE [dbo].[StudentAwards]  WITH CHECK ADD  CONSTRAINT [FK_StudentAwards_CompetitionAwards] FOREIGN KEY([CompetitionAwardId])
REFERENCES [dbo].[CompetitionAwards] ([Id])
GO
ALTER TABLE [dbo].[StudentAwards] CHECK CONSTRAINT [FK_StudentAwards_CompetitionAwards]
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
ALTER TABLE [dbo].[GradeDetails]  WITH CHECK ADD  CONSTRAINT [CK_GradeDetails_RawScore] CHECK  (([RawScore]>=(0) AND [RawScore]<=(100)))
GO
ALTER TABLE [dbo].[GradeDetails] CHECK CONSTRAINT [CK_GradeDetails_RawScore]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [CK_Notif_Type] CHECK  (([Type]='announcement' OR [Type]='purchase' OR [Type]='exhibition' OR [Type]='competition' OR [Type]='submission' OR [Type]='award'))
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [CK_Notif_Type]
GO
ALTER TABLE [dbo].[SubmissionReviews]  WITH CHECK ADD  CONSTRAINT [CK_RatingLevel] CHECK  (([RatingLevel]=N'Disqualified' OR [RatingLevel]=N'Normal' OR [RatingLevel]=N'Moderate' OR [RatingLevel]=N'Good' OR [RatingLevel]=N'Better' OR [RatingLevel]=N'Best'))
GO
ALTER TABLE [dbo].[SubmissionReviews] CHECK CONSTRAINT [CK_RatingLevel]
GO
/****** Object:  StoredProcedure [dbo].[sp_BroadcastAnnouncement]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_BroadcastAnnouncement]
    @Title    NVARCHAR(200),
    @Message  NVARCHAR(MAX),
    @Link     NVARCHAR(500) = NULL,
    @RoleName NVARCHAR(50)  = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Notifications (UserId, Type, Title, Message, Link)
    SELECT u.Id, 'announcement', @Title, @Message, @Link
    FROM Users u
    JOIN Roles r ON r.Id = u.RoleId
    WHERE u.IsActive = 1
      AND (@RoleName IS NULL OR r.RoleName = @RoleName);
END
GO
/****** Object:  StoredProcedure [dbo].[sp_MarkNotificationsRead]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_MarkNotificationsRead]
    @UserId         INT,
    @NotificationId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Notifications
    SET IsRead = 1
    WHERE UserId = @UserId
      AND (@NotificationId IS NULL OR Id = @NotificationId)
      AND IsRead = 0;
END
GO
/****** Object:  Trigger [dbo].[TRG_CompetitionCriteria_WeightSum_100]    Script Date: 03/04/2026 11:03:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  Trigger [dbo].[TRG_Notif_CompetitionStatus]    Script Date: 03/04/2026 11:03:39 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  Trigger [dbo].[TRG_Notif_ExhibitionAdded]    Script Date: 03/04/2026 11:03:39 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  Trigger [dbo].[TRG_Notif_ArtworkSold]    Script Date: 03/04/2026 11:03:39 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  Trigger [dbo].[TRG_Notif_AwardGranted]    Script Date: 03/04/2026 11:03:39 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ============================================================
-- 5. TRG_Notif_AwardGranted
--    Notifies student when award is granted
--    Uses CompetitionAwardId â†’ Awards join for name
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
        N'You won "' + a.AwardName + N'" for your submission "' + ISNULL(s.Title, N'Untitled') + N'".',
        N'/dashboard/my-awards',
        s.Id,
        s.CompetitionId
    FROM inserted i
    JOIN Submissions s        ON s.Id  = i.SubmissionId
    JOIN CompetitionAwards ca ON ca.Id = i.CompetitionAwardId
    JOIN Awards a             ON a.Id  = ca.AwardId;
END;
GO
ALTER TABLE [dbo].[StudentAwards] ENABLE TRIGGER [TRG_Notif_AwardGranted]
GO
/****** Object:  Trigger [dbo].[TRG_Notif_SubmissionReviewed]    Script Date: 03/04/2026 11:03:39 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
USE [master]
GO
ALTER DATABASE [FineArtsInstitute_Final] SET  READ_WRITE 
GO
