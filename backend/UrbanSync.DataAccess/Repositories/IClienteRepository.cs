using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public interface IClienteRepository : IGenericRepository<Cliente>
{
    Task<Cliente?> GetByCorreoAsync(string correo);
}
