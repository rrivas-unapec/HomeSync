using Microsoft.EntityFrameworkCore;
using UrbanSync.DataAccess.Context;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public class ClienteRepository : GenericRepository<Cliente>, IClienteRepository
{
    public ClienteRepository(UrbanSyncDbContext context) : base(context)
    {
    }

    public async Task<Cliente?> GetByCorreoAsync(string correo) =>
        await DbSet.AsNoTracking().FirstOrDefaultAsync(c => c.Correo == correo);
}
