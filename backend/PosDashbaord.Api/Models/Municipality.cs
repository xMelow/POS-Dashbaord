
namespace PosEagleDashboard.Api.Models;

public class Municipality
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RefnisCode { get; set; }
    public string Region { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public List<int> PostalCodes { get; set; } = new();
    public string Setup { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsPosCustomer { get; set; }
    public bool IsEagleBeActive { get; set; }
    public string LastUpdated { get; set; } = string.Empty;

}