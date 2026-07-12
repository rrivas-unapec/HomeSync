using UrbanSync.Business.DTOs;

namespace UrbanSync.Business.Interfaces;

public interface ISolicitudDeVisitaService
{
    Task<IReadOnlyList<SolicitudDeVisitaDto>> ObtenerTodasAsync();
    Task<SolicitudDeVisitaDto> CrearAsync(SolicitudDeVisitaCreateDto dto);
    Task<SolicitudDeVisitaDto> CambiarEstadoAsync(int id, SolicitudDeVisitaCambiarEstadoDto dto);
    Task CancelarAsync(int id);
}
