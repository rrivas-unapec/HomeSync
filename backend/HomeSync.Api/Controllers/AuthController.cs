using Microsoft.AspNetCore.Mvc;
using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public AuthController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>Autentica un usuario y devuelve un token JWT. Vista 0 - Login.</summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto dto)
    {
        var resultado = await _usuarioService.LoginAsync(dto);
        return Ok(resultado);
    }
}
