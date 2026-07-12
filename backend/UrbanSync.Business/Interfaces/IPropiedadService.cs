using UrbanSync.Business.DTOs;

namespace UrbanSync.Business.Interfaces;

public interface IPropiedadService
{
    Task<IReadOnlyList<PropiedadDto>> BuscarAsync(PropiedadFiltroDto filtro);
    Task<PropiedadDto> ObtenerPorIdAsync(int id);
    Task<PropiedadDto> CrearAsync(PropiedadCreateDto dto, int usuarioId);
    Task<PropiedadDto> ActualizarAsync(int id, PropiedadUpdateDto dto, int usuarioId);
    Task EliminarAsync(int id, int usuarioId);
}
