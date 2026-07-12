using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Repositories;

public interface ISolicitudDeVisitaRepository : IGenericRepository<SolicitudDeVisita>
{
    Task<SolicitudDeVisita?> GetByIdConDetalleAsync(int id);
    Task<IReadOnlyList<SolicitudDeVisita>> GetAllConDetalleAsync();
    Task<IReadOnlyList<(int PropiedadId, string Titulo, int TotalSolicitudes)>> GetTopPropiedadesSolicitadasAsync(int top);
}
