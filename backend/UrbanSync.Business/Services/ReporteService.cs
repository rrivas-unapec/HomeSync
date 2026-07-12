using UrbanSync.Business.DTOs;
using UrbanSync.Business.Interfaces;
using UrbanSync.DataAccess.Repositories;

namespace UrbanSync.Business.Services;

public class ReporteService : IReporteService
{
    private readonly IPropiedadRepository _propiedadRepository;
    private readonly ISolicitudDeVisitaRepository _solicitudRepository;

    public ReporteService(IPropiedadRepository propiedadRepository, ISolicitudDeVisitaRepository solicitudRepository)
    {
        _propiedadRepository = propiedadRepository;
        _solicitudRepository = solicitudRepository;
    }

    public async Task<IReadOnlyList<DistribucionTipoDto>> ObtenerDistribucionPorTipoAsync()
    {
        var distribucion = await _propiedadRepository.GetDistribucionPorTipoAsync();
        return distribucion.Select(d => new DistribucionTipoDto { Tipo = d.Tipo, Total = d.Total }).ToList();
    }

    public async Task<IReadOnlyList<PropiedadTopSolicitadaDto>> ObtenerTopSolicitadasAsync(int top = 5)
    {
        var resultado = await _solicitudRepository.GetTopPropiedadesSolicitadasAsync(top);
        return resultado.Select(r => new PropiedadTopSolicitadaDto
        {
            PropiedadId = r.PropiedadId,
            Titulo = r.Titulo,
            TotalSolicitudes = r.TotalSolicitudes
        }).ToList();
    }
}
