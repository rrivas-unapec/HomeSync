using HomeSync.Business.DTOs;

namespace HomeSync.Business.Interfaces;

public interface IAuditoriaService
{
    Task<IReadOnlyList<AuditoriaPropiedadDto>> ObtenerTodasAsync();
}
