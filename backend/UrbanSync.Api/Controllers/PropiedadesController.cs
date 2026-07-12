using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UrbanSync.Business.DTOs;
using UrbanSync.Business.Interfaces;
using UrbanSync.Domain.Common;

namespace UrbanSync.Api.Controllers;

[ApiController]
[Route("api/propiedades")]
public class PropiedadesController : ControllerBase
{
    private readonly IPropiedadService _propiedadService;

    public PropiedadesController(IPropiedadService propiedadService)
    {
        _propiedadService = propiedadService;
    }

    /// <summary>Lista propiedades con filtros opcionales por tipo, zona y rango de precio. Acceso publico.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PropiedadDto>>> Buscar(
        [FromQuery] string? tipo,
        [FromQuery] string? zona,
        [FromQuery] decimal? precioMinimo,
        [FromQuery] decimal? precioMaximo)
    {
        var filtro = new PropiedadFiltroDto
        {
            Tipo = tipo,
            Zona = zona,
            PrecioMinimo = precioMinimo,
            PrecioMaximo = precioMaximo
        };

        var propiedades = await _propiedadService.BuscarAsync(filtro);
        return Ok(propiedades);
    }

    /// <summary>Obtiene el detalle de una propiedad. Acceso publico.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PropiedadDto>> ObtenerPorId(int id)
    {
        var propiedad = await _propiedadService.ObtenerPorIdAsync(id);
        return Ok(propiedad);
    }

    /// <summary>Crea una nueva propiedad. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpPost]
    public async Task<ActionResult<PropiedadDto>> Crear([FromBody] PropiedadCreateDto dto)
    {
        var creada = await _propiedadService.CrearAsync(dto, ObtenerUsuarioId());
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    /// <summary>Actualiza una propiedad existente. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<PropiedadDto>> Actualizar(int id, [FromBody] PropiedadUpdateDto dto)
    {
        var actualizada = await _propiedadService.ActualizarAsync(id, dto, ObtenerUsuarioId());
        return Ok(actualizada);
    }

    /// <summary>Elimina una propiedad. Solo administrador.</summary>
    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        await _propiedadService.EliminarAsync(id, ObtenerUsuarioId());
        return NoContent();
    }

    private int ObtenerUsuarioId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
