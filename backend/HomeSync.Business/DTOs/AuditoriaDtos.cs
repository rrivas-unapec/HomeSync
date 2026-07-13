namespace HomeSync.Business.DTOs;

public class AuditoriaPropiedadDto
{
    public int Id { get; set; }
    public int PropiedadId { get; set; }
    public string? PropiedadTitulo { get; set; }
    public int? UsuarioId { get; set; }
    public string? UsuarioNombre { get; set; }
    public string Accion { get; set; } = string.Empty;
    public string? DetallesCambio { get; set; }
    public DateTime FechaOperacion { get; set; }
}
