using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public interface IAuditoriaPropiedadRepository : IGenericRepository<AuditoriaPropiedad>
{
    Task<IReadOnlyList<AuditoriaPropiedad>> GetAllConDetalleAsync();
}
