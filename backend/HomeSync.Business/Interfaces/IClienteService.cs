using HomeSync.Business.DTOs;

namespace HomeSync.Business.Interfaces;

public interface IClienteService
{
    Task<IReadOnlyList<ClienteDto>> ObtenerTodosAsync();
    Task<ClienteDto> ObtenerPorIdAsync(int id);
    Task<ClienteDto> CrearAsync(ClienteCreateDto dto);
    Task<ClienteDto> ActualizarAsync(int id, ClienteUpdateDto dto);
}
