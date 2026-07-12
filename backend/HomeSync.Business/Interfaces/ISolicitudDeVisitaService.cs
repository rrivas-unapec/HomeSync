using HomeSync.Business.DTOs;

namespace HomeSync.Business.Interfaces;

public interface ISolicitudDeVisitaService
{
    Task<IReadOnlyList<SolicitudDeVisitaDto>> ObtenerTodasAsync();
    Task<SolicitudDeVisitaDto> ObtenerPorIdAsync(int id);
    Task<SolicitudDeVisitaDto> CrearAsync(SolicitudDeVisitaCreateDto dto);
    Task<SolicitudDeVisitaDto> CambiarEstadoAsync(int id, SolicitudDeVisitaCambiarEstadoDto dto);
    Task CancelarAsync(int id);
}
