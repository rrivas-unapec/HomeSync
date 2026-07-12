namespace UrbanSync.Business.DTOs;

public class ClienteDto
{
    public int Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaRegistro { get; set; }
}

public class ClienteCreateDto
{
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
}

public class ClienteUpdateDto
{
    public string? Telefono { get; set; }
    public string? NombreCompleto { get; set; }
}
