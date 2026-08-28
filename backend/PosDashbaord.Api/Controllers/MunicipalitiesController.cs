using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PosEagleDashboard.Api.Data;
using PosEagleDashboard.Api.Models;

namespace PosEagleDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MunicipalitiesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public MunicipalitiesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IEnumerable<Municipality>> GetMunicipalities()
    {
        return await _dbContext.Municipalities.ToListAsync();
    }
}
