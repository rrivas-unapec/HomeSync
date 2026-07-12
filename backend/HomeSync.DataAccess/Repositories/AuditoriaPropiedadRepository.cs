using HomeSync.DataAccess.Context;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public class AuditoriaPropiedadRepository : GenericRepository<AuditoriaPropiedad>, IAuditoriaPropiedadRepository
{
    public AuditoriaPropiedadRepository(HomeSyncDbContext context) : base(context)
    {
    }
}
