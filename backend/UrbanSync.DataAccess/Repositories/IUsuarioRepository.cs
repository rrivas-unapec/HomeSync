using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public interface IUsuarioRepository : IGenericRepository<Usuario>
{
    Task<Usuario?> GetByCorreoAsync(string correo);
}
