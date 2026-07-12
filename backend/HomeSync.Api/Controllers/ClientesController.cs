using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;
using HomeSync.Domain.Common;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/clientes")]
[Authorize(Roles = RolUsuario.Administrador)]
public class ClientesController : ControllerBase
{
    private readonly IClienteService _clienteService;

    public ClientesController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    /// <summary>Lista los clientes registrados. Solo administrador.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClienteDto>>> ObtenerTodos()
    {
        var clientes = await _clienteService.ObtenerTodosAsync();
        return Ok(clientes);
    }

    /// <summary>Obtiene un cliente por su id. Solo administrador.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> ObtenerPorId(int id)
    {
        var cliente = await _clienteService.ObtenerPorIdAsync(id);
        return Ok(cliente);
    }

    /// <summary>Registra un nuevo cliente manualmente desde el panel de administracion.</summary>
    [HttpPost]
    public async Task<ActionResult<ClienteDto>> Crear([FromBody] ClienteCreateDto dto)
    {
        var creado = await _clienteService.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    /// <summary>Actualiza datos de contacto de un cliente.</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ClienteDto>> Actualizar(int id, [FromBody] ClienteUpdateDto dto)
    {
        var actualizado = await _clienteService.ActualizarAsync(id, dto);
        return Ok(actualizado);
    }
}
