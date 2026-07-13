using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;
using HomeSync.Domain.Common;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>Registra un nuevo usuario (administrador o cliente interno del panel).</summary>
    [HttpPost]
    public async Task<ActionResult<UsuarioDto>> Registrar([FromBody] UsuarioRegistroDto dto)
    {
        var creado = await _usuarioService.RegistrarAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    /// <summary>Lista los usuarios registrados. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UsuarioDto>>> ObtenerTodos()
    {
        var usuarios = await _usuarioService.ObtenerTodosAsync();
        return Ok(usuarios);
    }

    /// <summary>Obtiene el perfil del usuario autenticado o de un id especifico.</summary>
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioDto>> ObtenerPorId(int id)
    {
        var usuario = await _usuarioService.ObtenerPorIdAsync(id);
        return Ok(usuario);
    }
}
