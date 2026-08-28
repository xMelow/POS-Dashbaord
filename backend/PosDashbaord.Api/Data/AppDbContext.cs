using Microsoft.EntityFrameworkCore;
using PosEagleDashboard.Api.Models;

namespace PosEagleDashboard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Municipality> Municipalities => Set<Municipality>();
}