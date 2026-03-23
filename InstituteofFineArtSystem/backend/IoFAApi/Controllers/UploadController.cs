using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IoFAApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController(IConfiguration config, IWebHostEnvironment env) : ControllerBase
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        if (file.Length > MaxFileSize)
            return BadRequest(new { message = "File size exceeds 10MB limit" });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = "Only image files are allowed (jpg, png, gif, webp)" });

        // Resolve storage path — absolute or relative to content root
        var storagePath = config["Upload:StoragePath"] ?? "uploads";
        string uploadDir;
        if (Path.IsPathRooted(storagePath))
            uploadDir = storagePath;
        else
            uploadDir = Path.Combine(env.ContentRootPath, storagePath);

        Directory.CreateDirectory(uploadDir);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadDir, fileName);

        using (var stream = System.IO.File.Create(filePath))
            await file.CopyToAsync(stream);

        var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        return Ok(new { url });
    }
}
