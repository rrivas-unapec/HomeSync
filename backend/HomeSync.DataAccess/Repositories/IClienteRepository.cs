using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public interface IClienteRepository : IGenericRepository<Cliente>
{
    Task<Cliente?> GetByCorreoAsync(string correo);
}
