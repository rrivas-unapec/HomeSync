using Microsoft.EntityFrameworkCore;
using UrbanSync.DataAccess.Context;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public class PropiedadRepository : GenericRepository<Propiedad>, IPropiedadRepository
{
    public PropiedadRepository(UrbanSyncDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Propiedad>> BuscarAsync(FiltroPropiedades filtro)
    {
        var query = DbSet.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(filtro.Tipo))
            query = query.Where(p => p.Tipo == filtro.Tipo);

        if (!string.IsNullOrWhiteSpace(filtro.Zona))
            query = query.Where(p => p.UbicacionZona.Contains(filtro.Zona));

        if (filtro.PrecioMinimo.HasValue)
            query = query.Where(p => p.Precio >= filtro.PrecioMinimo.Value);

        if (filtro.PrecioMaximo.HasValue)
            query = query.Where(p => p.Precio <= filtro.PrecioMaximo.Value);

        return await query.OrderByDescending(p => p.FechaCreacion).ToListAsync();
    }

    public async Task<IReadOnlyList<(string Tipo, int Total)>> GetDistribucionPorTipoAsync()
    {
        var resultado = await DbSet.AsNoTracking()
            .GroupBy(p => p.Tipo)
            .Select(g => new { Tipo = g.Key, Total = g.Count() })
            .ToListAsync();

        return resultado.Select(r => (r.Tipo, r.Total)).ToList();
    }
}
