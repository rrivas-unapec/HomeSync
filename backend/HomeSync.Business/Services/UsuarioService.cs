using HomeSync.Business.DTOs;
using HomeSync.Business.Exceptions;
using HomeSync.Business.Interfaces;
using HomeSync.DataAccess.Repositories;
using HomeSync.Domain.Common;
using HomeSync.Domain.Entities;

namespace HomeSync.Business.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IJwtService _jwtService;

    public UsuarioService(IUsuarioRepository usuarioRepository, IJwtService jwtService)
    {
        _usuarioRepository = usuarioRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        var usuario = await _usuarioRepository.GetByCorreoAsync(dto.Correo)
            ?? throw new UnauthorizedBusinessException("Correo o contrasena invalidos.");

        var esValida = BCrypt.Net.BCrypt.Verify(dto.Contrasena, usuario.ContrasenaHash);
        if (!esValida)
            throw new UnauthorizedBusinessException("Correo o contrasena invalidos.");

        var (token, expiraEn) = _jwtService.GenerarToken(usuario);

        return new LoginResponseDto
        {
            Token = token,
            ExpiraEn = expiraEn,
            Usuario = MapearDto(usuario)
        };
    }

    public async Task<UsuarioDto> RegistrarAsync(UsuarioRegistroDto dto)
    {
        if (dto.Rol != RolUsuario.Administrador && dto.Rol != RolUsuario.Cliente)
            throw new BusinessException($"El rol debe ser '{RolUsuario.Administrador}' o '{RolUsuario.Cliente}'.");

        var existente = await _usuarioRepository.GetByCorreoAsync(dto.Correo);
        if (existente is not null)
            throw new BusinessException("Ya existe un usuario registrado con ese correo.");

        var usuario = new Usuario
        {
            Nombre = dto.Nombre,
            Correo = dto.Correo,
            ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(dto.Contrasena),
            Rol = dto.Rol,
            FechaCreacion = DateTime.UtcNow
        };

        await _usuarioRepository.AddAsync(usuario);
        await _usuarioRepository.SaveChangesAsync();

        return MapearDto(usuario);
    }

    public async Task<UsuarioDto> ObtenerPorIdAsync(int id)
    {
        var usuario = await _usuarioRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe el usuario con id {id}.");

        return MapearDto(usuario);
    }

    public async Task<IReadOnlyList<UsuarioDto>> ObtenerTodosAsync()
    {
        var usuarios = await _usuarioRepository.GetAllOrdenadosAsync();
        return usuarios.Select(MapearDto).ToList();
    }

    private static UsuarioDto MapearDto(Usuario u) => new()
    {
        Id = u.Id,
        Nombre = u.Nombre,
        Correo = u.Correo,
        Rol = u.Rol,
        FechaCreacion = u.FechaCreacion
    };
}
