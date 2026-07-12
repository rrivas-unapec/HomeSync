namespace UrbanSync.Business.DTOs;

public class PropiedadDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public string UbicacionZona { get; set; } = string.Empty;
    public int Habitaciones { get; set; }
    public int Banos { get; set; }
    public int Parqueos { get; set; }
    public string? FotoUrl { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
}

public class PropiedadCreateDto
{
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public string UbicacionZona { get; set; } = string.Empty;
    public int Habitaciones { get; set; }
    public int Banos { get; set; }
    public int Parqueos { get; set; }
    public string? FotoUrl { get; set; }
}

public class PropiedadUpdateDto
{
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public string UbicacionZona { get; set; } = string.Empty;
    public int Habitaciones { get; set; }
    public int Banos { get; set; }
    public int Parqueos { get; set; }
    public string? FotoUrl { get; set; }
    public string Estado { get; set; } = string.Empty;
}

public class PropiedadFiltroDto
{
    public string? Tipo { get; set; }
    public string? Zona { get; set; }
    public decimal? PrecioMinimo { get; set; }
    public decimal? PrecioMaximo { get; set; }
}
