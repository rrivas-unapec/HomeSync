using Microsoft.EntityFrameworkCore;
using UrbanSync.DataAccess.Context;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public class SolicitudDeVisitaRepository : GenericRepository<SolicitudDeVisita>, ISolicitudDeVisitaRepository
{
    public SolicitudDeVisitaRepository(UrbanSyncDbContext context) : base(context)
    {
    }

    public async Task<SolicitudDeVisita?> GetByIdConDetalleAsync(int id) =>
        await DbSet.Include(s => s.Propiedad)
                   .Include(s => s.Cliente)
                   .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<IReadOnlyList<SolicitudDeVisita>> GetAllConDetalleAsync() =>
        await DbSet.AsNoTracking()
                   .Include(s => s.Propiedad)
                   .Include(s => s.Cliente)
                   .OrderByDescending(s => s.FechaCreacion)
                   .ToListAsync();

    public async Task<IReadOnlyList<(int PropiedadId, string Titulo, int TotalSolicitudes)>> GetTopPropiedadesSolicitadasAsync(int top)
    {
        var resultado = await DbSet.AsNoTracking()
            .GroupBy(s => new { s.PropiedadId, s.Propiedad!.Titulo })
            .Select(g => new
            {
                g.Key.PropiedadId,
                g.Key.Titulo,
                Total = g.Count()
            })
            .OrderByDescending(g => g.Total)
            .Take(top)
            .ToListAsync();

        return resultado.Select(r => (r.PropiedadId, r.Titulo, r.Total)).ToList();
    }
}
