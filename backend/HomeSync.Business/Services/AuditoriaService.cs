using HomeSync.Business.DTOs;
using HomeSync.Business.Interfaces;
using HomeSync.DataAccess.Repositories;
using HomeSync.Domain.Entities;

namespace HomeSync.Business.Services;

public class AuditoriaService : IAuditoriaService
{
    private readonly IAuditoriaPropiedadRepository _auditoriaRepository;

    public AuditoriaService(IAuditoriaPropiedadRepository auditoriaRepository)
    {
        _auditoriaRepository = auditoriaRepository;
    }

    public async Task<IReadOnlyList<AuditoriaPropiedadDto>> ObtenerTodasAsync()
    {
        var registros = await _auditoriaRepository.GetAllConDetalleAsync();
        return registros.Select(MapearDto).ToList();
    }

    private static AuditoriaPropiedadDto MapearDto(AuditoriaPropiedad a) => new()
    {
        Id = a.Id,
        PropiedadId = a.PropiedadId,
        PropiedadTitulo = a.Propiedad?.Titulo,
        UsuarioId = a.UsuarioId,
        UsuarioNombre = a.Usuario?.Nombre,
        Accion = a.Accion,
        DetallesCambio = a.DetallesCambio,
        FechaOperacion = a.FechaOperacion
    };
}
