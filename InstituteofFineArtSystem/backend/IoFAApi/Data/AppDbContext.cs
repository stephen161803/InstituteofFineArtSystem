using IoFAApi.Models;
using Microsoft.EntityFrameworkCore;

namespace IoFAApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Staff> Staffs => Set<Staff>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Competition> Competitions => Set<Competition>();
    public DbSet<Criteria> Criteria => Set<Criteria>();
    public DbSet<CompetitionCriteria> CompetitionCriteria => Set<CompetitionCriteria>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<SubmissionReview> SubmissionReviews => Set<SubmissionReview>();
    public DbSet<GradeDetail> GradeDetails => Set<GradeDetail>();
    public DbSet<Award> Awards => Set<Award>();
    public DbSet<StudentAward> StudentAwards => Set<StudentAward>();
    public DbSet<Exhibition> Exhibitions => Set<Exhibition>();
    public DbSet<ExhibitionSubmission> ExhibitionSubmissions => Set<ExhibitionSubmission>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // User → Role
        mb.Entity<User>()
            .HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId);

        // Student (1-1 with User)
        mb.Entity<Student>()
            .HasKey(s => s.UserId);
        mb.Entity<Student>()
            .HasOne(s => s.User).WithOne(u => u.Student).HasForeignKey<Student>(s => s.UserId);

        // Staff (1-1 with User)
        mb.Entity<Staff>()
            .HasKey(s => s.UserId);
        mb.Entity<Staff>()
            .HasOne(s => s.User).WithOne(u => u.Staff).HasForeignKey<Staff>(s => s.UserId);

        // Customer (1-1 with User)
        mb.Entity<Customer>()
            .HasOne(c => c.User).WithOne(u => u.Customer).HasForeignKey<Customer>(c => c.UserId);

        // Competition → Creator (User, optional)
        mb.Entity<Competition>()
            .HasOne(c => c.Creator).WithMany().HasForeignKey(c => c.CreatedBy).IsRequired(false);
        mb.Entity<Competition>()
            .ToTable("Competitions", tb => tb.HasTrigger("dummy_trigger_marker_comp")); // table has triggers

        // CompetitionCriteria unique constraint
        mb.Entity<CompetitionCriteria>()
            .HasIndex(cc => new { cc.CompetitionId, cc.CriteriaId }).IsUnique();
        mb.Entity<CompetitionCriteria>()
            .Property(cc => cc.WeightPercent).HasColumnType("decimal(6,2)");

        // Submission → Competition, Student (FK StudentId → Users.Id)
        mb.Entity<Submission>()
            .HasOne(s => s.Competition).WithMany(c => c.Submissions).HasForeignKey(s => s.CompetitionId);
        mb.Entity<Submission>()
            .HasOne(s => s.Student).WithMany()
            .HasForeignKey(s => s.StudentId)
            .HasPrincipalKey(u => u.Id);
        mb.Entity<Submission>()
            .Property(s => s.StudentId).HasColumnName("StudentId");
        mb.Entity<Submission>()
            .Property(s => s.ProposedPrice).HasColumnType("decimal(18,2)");

        // SubmissionReview (1-1 with Submission)
        mb.Entity<SubmissionReview>()
            .HasOne(r => r.Submission).WithOne(s => s.Review).HasForeignKey<SubmissionReview>(r => r.SubmissionId);
        mb.Entity<SubmissionReview>()
            .HasOne(r => r.Staff).WithMany().HasForeignKey(r => r.StaffId);

        // GradeDetail unique per review+criteria
        mb.Entity<GradeDetail>()
            .HasIndex(g => new { g.ReviewId, g.CriteriaId }).IsUnique();
        mb.Entity<GradeDetail>()
            .Property(g => g.RawScore).HasColumnType("decimal(5,2)");

        // StudentAward
        mb.Entity<StudentAward>()
            .HasOne(sa => sa.Submission).WithMany(s => s.StudentAwards).HasForeignKey(sa => sa.SubmissionId);
        mb.Entity<StudentAward>()
            .HasOne(sa => sa.Award).WithMany(a => a.StudentAwards).HasForeignKey(sa => sa.AwardId);
        mb.Entity<StudentAward>()
            .HasOne(sa => sa.AwardedByUser).WithMany().HasForeignKey(sa => sa.AwardedBy);
        mb.Entity<StudentAward>()
            .ToTable("StudentAwards", tb => tb.HasTrigger("dummy_trigger_marker_sa")); // table has triggers

        // ExhibitionSubmission
        mb.Entity<ExhibitionSubmission>()
            .HasOne(es => es.Exhibition).WithMany(e => e.ExhibitionSubmissions).HasForeignKey(es => es.ExhibitionId);
        mb.Entity<ExhibitionSubmission>()
            .HasOne(es => es.Submission).WithMany(s => s.ExhibitionSubmissions).HasForeignKey(es => es.SubmissionId);
        mb.Entity<ExhibitionSubmission>()
            .Property(es => es.ProposedPrice).HasColumnType("decimal(18,2)");

        // Sale
        mb.Entity<Sale>()
            .HasOne(s => s.ExhibitionSubmission).WithMany(es => es.Sales).HasForeignKey(s => s.ExhibitionSubmissionId);
        mb.Entity<Sale>()
            .HasOne(s => s.Customer).WithMany(c => c.Sales).HasForeignKey(s => s.CustomerId);
        mb.Entity<Sale>()
            .Property(s => s.SoldPrice).HasColumnType("decimal(18,2)");
        mb.Entity<Sale>()
            .ToTable(tb => tb.HasTrigger("dummy_trigger_marker")); // table has triggers — disable OUTPUT clause

        mb.Entity<SubmissionReview>()
            .ToTable("SubmissionReviews", tb => tb.HasTrigger("dummy_trigger_marker_sr")); // table has triggers

        mb.Entity<ExhibitionSubmission>()
            .ToTable("ExhibitionSubmissions", tb => tb.HasTrigger("dummy_trigger_marker_es")); // table has triggers

        mb.Entity<CompetitionCriteria>()
            .ToTable("CompetitionCriteria", tb => tb.HasTrigger("dummy_trigger_marker_cc")); // table has triggers

        // Notification
        mb.Entity<Notification>()
            .HasOne(n => n.User).WithMany().HasForeignKey(n => n.UserId);

        // RefreshToken
        mb.Entity<RefreshToken>()
            .HasOne(r => r.User).WithMany().HasForeignKey(r => r.UserId);

        // Map table names to match SQL schema
        mb.Entity<Staff>().ToTable("Staffs");
        mb.Entity<CompetitionCriteria>().ToTable("CompetitionCriteria");
        mb.Entity<SubmissionReview>().ToTable("SubmissionReviews");
        mb.Entity<GradeDetail>().ToTable("GradeDetails");
        mb.Entity<StudentAward>().ToTable("StudentAwards");
        mb.Entity<ExhibitionSubmission>().ToTable("ExhibitionSubmissions");

        // Ignore computed view (handled via raw SQL if needed)
        // mb.Entity<SubmissionTotalScore>().HasNoKey().ToView("vw_SubmissionTotalScore");
    }
}
