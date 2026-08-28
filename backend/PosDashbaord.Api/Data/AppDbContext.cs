using Microsoft.EntityFrameworkCore;
using PosEagleDashboard.Api.Models;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace PosEagleDashboard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Municipality> Municipalities => Set<Municipality>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var postalCodesComparer = new ValueComparer<List<int>>(
            (a, b) => a!.SequenceEqual(b!),
            v => v.Aggregate(0, (hash, code) => HashCode.Combine(hash, code)),
            v => v.ToList());

        modelBuilder.Entity<Municipality>()
            .Property(m => m.PostalCodes)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<int>>(v, (JsonSerializerOptions?)null) ?? new List<int>())
            .Metadata.SetValueComparer(postalCodesComparer);
    }
}