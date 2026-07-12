namespace HomeSync.Business.DTOs;

public class SolicitudDeVisitaDto
{
    public int Id { get; set; }
    public int PropiedadId { get; set; }
    public string? PropiedadTitulo { get; set; }
    public int ClienteId { get; set; }
    public string? ClienteNombre { get; set; }
    public DateOnly FechaSugerida { get; set; }
    public string Horario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
}

/// <summary>
/// Captura el interes del cliente desde el catalogo publico. Si el cliente no existe
/// (por correo) se crea automaticamente, tal como pide la Vista 3 del catalogo.
/// </summary>
public class SolicitudDeVisitaCreateDto
{
    public int PropiedadId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateOnly FechaSugerida { get; set; }
    public string Horario { get; set; } = string.Empty;
}

public class SolicitudDeVisitaCambiarEstadoDto
{
    public string Estado { get; set; } = string.Empty;
}
