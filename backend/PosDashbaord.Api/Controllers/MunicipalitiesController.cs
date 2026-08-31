using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PosEagleDashboard.Api.Data;
using PosEagleDashboard.Api.Models;
using PosEagleDashboard.Api.DTO;

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

    [HttpPost("{id:int}")]
    public async Task<ActionResult<Municipality>> UpdateMunicipality(int id, [FromBody] UpdateMunicipalityRequest request)
    {
        var municipality = await _dbContext.Municipalities.FindAsync(id);
        if (municipality is null)
        {
            return NotFound();
        }

        municipality.Setup = request.Setup;
        municipality.Status = request.Status;

        switch (request.Setup)
        {
            case "EagleBe":
                municipality.IsPosCustomer = true;
                municipality.IsEagleBeActive = true;
                break;
            case "Park-O-Sign":
                municipality.IsPosCustomer = true;
                municipality.IsEagleBeActive = false;
                break;
            case "Geen":
                municipality.IsPosCustomer = false;
                municipality.IsEagleBeActive = false;
                break;
        }

        municipality.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

        await _dbContext.SaveChangesAsync();
        return municipality;
    }
}
