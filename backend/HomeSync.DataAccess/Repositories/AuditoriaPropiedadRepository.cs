using Microsoft.EntityFrameworkCore;
using HomeSync.DataAccess.Context;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public class AuditoriaPropiedadRepository : GenericRepository<AuditoriaPropiedad>, IAuditoriaPropiedadRepository
{
    public AuditoriaPropiedadRepository(HomeSyncDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<AuditoriaPropiedad>> GetAllConDetalleAsync()
    {
        var registros = await DbSet.AsNoTracking()
                                   .Include(a => a.Usuario)
                                   .OrderByDescending(a => a.FechaOperacion)
                                   .ThenByDescending(a => a.Id)
                                   .ToListAsync();

        var propiedadIds = registros.Select(a => a.PropiedadId).Distinct().ToList();

        var propiedades = await Context.Set<Propiedad>()
                                       .AsNoTracking()
                                       .Where(p => propiedadIds.Contains(p.Id))
                                       .ToDictionaryAsync(p => p.Id);

        foreach (var registro in registros)
        {
            if (propiedades.TryGetValue(registro.PropiedadId, out var propiedad))
                registro.Propiedad = propiedad;
        }

        return registros;
    }
}
