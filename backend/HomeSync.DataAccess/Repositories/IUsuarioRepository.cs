using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public interface IUsuarioRepository : IGenericRepository<Usuario>
{
    Task<Usuario?> GetByCorreoAsync(string correo);
}
