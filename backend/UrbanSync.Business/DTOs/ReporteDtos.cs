namespace UrbanSync.Business.DTOs;

public class DistribucionTipoDto
{
    public string Tipo { get; set; } = string.Empty;
    public int Total { get; set; }
}

public class PropiedadTopSolicitadaDto
{
    public int PropiedadId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public int TotalSolicitudes { get; set; }
}
