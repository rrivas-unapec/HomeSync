using Microsoft.EntityFrameworkCore;
using UrbanSync.DataAccess.Context;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
{
    public UsuarioRepository(UrbanSyncDbContext context) : base(context)
    {
    }

    public async Task<Usuario?> GetByCorreoAsync(string correo) =>
        await DbSet.FirstOrDefaultAsync(u => u.Correo == correo);
}
