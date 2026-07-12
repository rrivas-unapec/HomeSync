namespace HomeSync.Domain.Entities;

public class Cliente
{
    public int Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaRegistro { get; set; }

    public ICollection<SolicitudDeVisita> Solicitudes { get; set; } = new List<SolicitudDeVisita>();
}
