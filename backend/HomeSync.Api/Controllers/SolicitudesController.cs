using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;
using HomeSync.Domain.Common;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/solicitudes")]
public class SolicitudesController : ControllerBase
{
    private readonly ISolicitudDeVisitaService _solicitudService;

    public SolicitudesController(ISolicitudDeVisitaService solicitudService)
    {
        _solicitudService = solicitudService;
    }

    /// <summary>Lista todas las solicitudes de visita. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SolicitudDeVisitaDto>>> ObtenerTodas()
    {
        var solicitudes = await _solicitudService.ObtenerTodasAsync();
        return Ok(solicitudes);
    }

    /// <summary>Obtiene una solicitud de visita por su id. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SolicitudDeVisitaDto>> ObtenerPorId(int id)
    {
        var solicitud = await _solicitudService.ObtenerPorIdAsync(id);
        return Ok(solicitud);
    }

    /// <summary>Crea una nueva solicitud de visita desde el catalogo publico (Vista 3). Acceso publico.</summary>
    [HttpPost]
    public async Task<ActionResult<SolicitudDeVisitaDto>> Crear([FromBody] SolicitudDeVisitaCreateDto dto)
    {
        var creada = await _solicitudService.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    /// <summary>Cambia el estado de una solicitud (pendiente/confirmada/completada). Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult<SolicitudDeVisitaDto>> CambiarEstado(int id, [FromBody] SolicitudDeVisitaCambiarEstadoDto dto)
    {
        var actualizada = await _solicitudService.CambiarEstadoAsync(id, dto);
        return Ok(actualizada);
    }

    /// <summary>Cancela (elimina) una solicitud. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Cancelar(int id)
    {
        await _solicitudService.CancelarAsync(id);
        return NoContent();
    }
}
