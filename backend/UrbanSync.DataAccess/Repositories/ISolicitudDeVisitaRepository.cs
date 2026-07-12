using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public interface ISolicitudDeVisitaRepository : IGenericRepository<SolicitudDeVisita>
{
    Task<SolicitudDeVisita?> GetByIdConDetalleAsync(int id);
    Task<IReadOnlyList<SolicitudDeVisita>> GetAllConDetalleAsync();
    Task<IReadOnlyList<(int PropiedadId, string Titulo, int TotalSolicitudes)>> GetTopPropiedadesSolicitadasAsync(int top);
}
