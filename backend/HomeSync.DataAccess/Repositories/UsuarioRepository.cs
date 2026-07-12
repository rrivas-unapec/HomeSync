using Microsoft.EntityFrameworkCore;
using HomeSync.DataAccess.Context;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
{
    public UsuarioRepository(HomeSyncDbContext context) : base(context)
    {
    }

    public async Task<Usuario?> GetByCorreoAsync(string correo) =>
        await DbSet.FirstOrDefaultAsync(u => u.Correo == correo);
}
