namespace UrbanSync.Domain.Entities;

public class AuditoriaPropiedad
{
    public int Id { get; set; }
    public int PropiedadId { get; set; }
    public int? UsuarioId { get; set; }
    public string Accion { get; set; } = string.Empty; // CREACION | EDICION | ELIMINACION
    public string? DetallesCambio { get; set; }
    public DateTime FechaOperacion { get; set; }

    public Propiedad? Propiedad { get; set; }
    public Usuario? Usuario { get; set; }
}
