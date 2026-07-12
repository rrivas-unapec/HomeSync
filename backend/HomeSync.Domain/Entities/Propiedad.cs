namespace HomeSync.Domain.Entities;

public class Propiedad
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Tipo { get; set; } = string.Empty; // alquiler | venta
    public decimal Precio { get; set; }
    public string UbicacionZona { get; set; } = string.Empty;
    public int Habitaciones { get; set; }
    public int Banos { get; set; }
    public int Parqueos { get; set; }
    public string? FotoUrl { get; set; }
    public string Estado { get; set; } = string.Empty; // disponible | reservada | inactiva
    public DateTime FechaCreacion { get; set; }

    public ICollection<SolicitudDeVisita> Solicitudes { get; set; } = new List<SolicitudDeVisita>();
    public ICollection<AuditoriaPropiedad> Auditorias { get; set; } = new List<AuditoriaPropiedad>();
}
