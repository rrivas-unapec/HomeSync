using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;
using HomeSync.Domain.Common;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/auditoria")]
[Authorize(Roles = RolUsuario.Administrador)]
public class AuditoriaController : ControllerBase
{
    private readonly IAuditoriaService _auditoriaService;

    public AuditoriaController(IAuditoriaService auditoriaService)
    {
        _auditoriaService = auditoriaService;
    }

    /// <summary>Lista la bitacora de operaciones sobre propiedades. Solo administrador.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AuditoriaPropiedadDto>>> ObtenerTodas()
    {
        var registros = await _auditoriaService.ObtenerTodasAsync();
        return Ok(registros);
    }
}
