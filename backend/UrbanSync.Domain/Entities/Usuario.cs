namespace UrbanSync.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string ContrasenaHash { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty; // administrador | cliente
    public DateTime FechaCreacion { get; set; }

    public ICollection<AuditoriaPropiedad> Auditorias { get; set; } = new List<AuditoriaPropiedad>();
}
