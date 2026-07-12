using UrbanSync.Business.DTOs;

namespace UrbanSync.Business.Interfaces;

public interface IReporteService
{
    Task<IReadOnlyList<DistribucionTipoDto>> ObtenerDistribucionPorTipoAsync();
    Task<IReadOnlyList<PropiedadTopSolicitadaDto>> ObtenerTopSolicitadasAsync(int top = 5);
}
