using HomeSync.Business.DTOs;

namespace HomeSync.Business.Interfaces;

public interface IReporteService
{
    Task<IReadOnlyList<DistribucionTipoDto>> ObtenerDistribucionPorTipoAsync();
    Task<IReadOnlyList<PropiedadTopSolicitadaDto>> ObtenerTopSolicitadasAsync(int top = 5);
}
