namespace HomeSync.Domain.Entities;

public class SolicitudDeVisita
{
    public int Id { get; set; }
    public int PropiedadId { get; set; }
    public int ClienteId { get; set; }
    public DateOnly FechaSugerida { get; set; }
    public string Horario { get; set; } = string.Empty; // manana | tarde
    public string Estado { get; set; } = string.Empty;  // pendiente | confirmada | completada
    public DateTime FechaCreacion { get; set; }

    public Propiedad? Propiedad { get; set; }
    public Cliente? Cliente { get; set; }
}
