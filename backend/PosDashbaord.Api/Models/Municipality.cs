
namespace Models;

public class Municipality
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RefnisCode { get; set; }
    public string Region { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public List<string> PostalCodes { get; set; } = [];
    public string Status { get; set; } = string.Empty;
    
}