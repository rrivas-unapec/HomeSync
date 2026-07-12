using UrbanSync.DataAccess.Context;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public class AuditoriaPropiedadRepository : GenericRepository<AuditoriaPropiedad>, IAuditoriaPropiedadRepository
{
    public AuditoriaPropiedadRepository(UrbanSyncDbContext context) : base(context)
    {
    }
}
