using UrbanSync.Business.DTOs;

namespace UrbanSync.Business.Interfaces;

public interface IUsuarioService
{
    Task<LoginResponseDto> LoginAsync(LoginDto dto);
    Task<UsuarioDto> RegistrarAsync(UsuarioRegistroDto dto);
    Task<UsuarioDto> ObtenerPorIdAsync(int id);
}
