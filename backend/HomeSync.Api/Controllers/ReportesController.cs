using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;
using HomeSync.Domain.Common;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/reportes")]
[Authorize(Roles = RolUsuario.Administrador)]
public class ReportesController : ControllerBase
{
    private readonly IReporteService _reporteService;

    public ReportesController(IReporteService reporteService)
    {
        _reporteService = reporteService;
    }

    /// <summary>Cantidad de propiedades por tipo (alquiler vs venta). Vista 4 - Reportes.</summary>
    [HttpGet("distribucion-tipo")]
    public async Task<ActionResult<IReadOnlyList<DistribucionTipoDto>>> DistribucionPorTipo()
    {
        var resultado = await _reporteService.ObtenerDistribucionPorTipoAsync();
        return Ok(resultado);
    }

    /// <summary>Top 5 propiedades con mas solicitudes de visita. Vista 4 - Reportes.</summary>
    [HttpGet("top-solicitadas")]
    public async Task<ActionResult<IReadOnlyList<PropiedadTopSolicitadaDto>>> TopSolicitadas([FromQuery] int top = 5)
    {
        var resultado = await _reporteService.ObtenerTopSolicitadasAsync(top);
        return Ok(resultado);
    }
}
