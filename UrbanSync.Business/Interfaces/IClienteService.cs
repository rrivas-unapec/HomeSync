using UrbanSync.Business.DTOs;

namespace UrbanSync.Business.Interfaces;

public interface IClienteService
{
    Task<IReadOnlyList<ClienteDto>> ObtenerTodosAsync();
    Task<ClienteDto> ObtenerPorIdAsync(int id);
    Task<ClienteDto> CrearAsync(ClienteCreateDto dto);
    Task<ClienteDto> ActualizarAsync(int id, ClienteUpdateDto dto);
}
