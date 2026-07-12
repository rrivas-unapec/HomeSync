using Microsoft.EntityFrameworkCore;
using HomeSync.DataAccess.Context;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public class ClienteRepository : GenericRepository<Cliente>, IClienteRepository
{
    public ClienteRepository(HomeSyncDbContext context) : base(context)
    {
    }

    public async Task<Cliente?> GetByCorreoAsync(string correo) =>
        await DbSet.AsNoTracking().FirstOrDefaultAsync(c => c.Correo == correo);
}
