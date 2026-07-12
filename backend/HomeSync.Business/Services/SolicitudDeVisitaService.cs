using HomeSync.Business.DTOs;
using HomeSync.Business.Exceptions;
using HomeSync.Business.Interfaces;
using HomeSync.DataAccess.Repositories;
using HomeSync.Domain.Common;
using HomeSync.Domain.Entities;

namespace HomeSync.Business.Services;

public class SolicitudDeVisitaService : ISolicitudDeVisitaService
{
    private readonly ISolicitudDeVisitaRepository _solicitudRepository;
    private readonly IPropiedadRepository _propiedadRepository;
    private readonly IClienteRepository _clienteRepository;

    private static readonly string[] HorariosValidos = { HorarioVisita.Manana, HorarioVisita.Tarde };
    private static readonly string[] EstadosValidos =
        { EstadoSolicitud.Pendiente, EstadoSolicitud.Confirmada, EstadoSolicitud.Completada };

    public SolicitudDeVisitaService(
        ISolicitudDeVisitaRepository solicitudRepository,
        IPropiedadRepository propiedadRepository,
        IClienteRepository clienteRepository)
    {
        _solicitudRepository = solicitudRepository;
        _propiedadRepository = propiedadRepository;
        _clienteRepository = clienteRepository;
    }

    public async Task<IReadOnlyList<SolicitudDeVisitaDto>> ObtenerTodasAsync()
    {
        var solicitudes = await _solicitudRepository.GetAllConDetalleAsync();
        return solicitudes.Select(MapearDto).ToList();
    }

    public async Task<SolicitudDeVisitaDto> CrearAsync(SolicitudDeVisitaCreateDto dto)
    {
        if (!HorariosValidos.Contains(dto.Horario))
            throw new BusinessException($"Horario invalido. Valores permitidos: {string.Join(", ", HorariosValidos)}.");

        var propiedad = await _propiedadRepository.GetByIdAsync(dto.PropiedadId)
            ?? throw new NotFoundException($"No existe la propiedad con id {dto.PropiedadId}.");

        if (propiedad.Estado == EstadoPropiedad.Inactiva)
            throw new BusinessException("No se pueden agendar visitas para una propiedad inactiva.");

        var cliente = await _clienteRepository.GetByCorreoAsync(dto.Correo);
        if (cliente is null)
        {
            cliente = new Cliente
            {
                NombreCompleto = dto.NombreCompleto,
                Correo = dto.Correo,
                Telefono = dto.Telefono,
                FechaRegistro = DateTime.UtcNow
            };
            await _clienteRepository.AddAsync(cliente);
            await _clienteRepository.SaveChangesAsync();
        }

        var solicitud = new SolicitudDeVisita
        {
            PropiedadId = dto.PropiedadId,
            ClienteId = cliente.Id,
            FechaSugerida = dto.FechaSugerida,
            Horario = dto.Horario,
            Estado = EstadoSolicitud.Pendiente,
            FechaCreacion = DateTime.UtcNow
        };

        await _solicitudRepository.AddAsync(solicitud);
        await _solicitudRepository.SaveChangesAsync();

        var creada = await _solicitudRepository.GetByIdConDetalleAsync(solicitud.Id);
        return MapearDto(creada!);
    }

    public async Task<SolicitudDeVisitaDto> CambiarEstadoAsync(int id, SolicitudDeVisitaCambiarEstadoDto dto)
    {
        if (!EstadosValidos.Contains(dto.Estado))
            throw new BusinessException($"Estado invalido. Valores permitidos: {string.Join(", ", EstadosValidos)}.");

        var solicitud = await _solicitudRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe la solicitud con id {id}.");

        solicitud.Estado = dto.Estado;
        _solicitudRepository.Update(solicitud);
        await _solicitudRepository.SaveChangesAsync();

        var actualizada = await _solicitudRepository.GetByIdConDetalleAsync(id);
        return MapearDto(actualizada!);
    }

    public async Task CancelarAsync(int id)
    {
        var solicitud = await _solicitudRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe la solicitud con id {id}.");

        _solicitudRepository.Remove(solicitud);
        await _solicitudRepository.SaveChangesAsync();
    }

    private static SolicitudDeVisitaDto MapearDto(SolicitudDeVisita s) => new()
    {
        Id = s.Id,
        PropiedadId = s.PropiedadId,
        PropiedadTitulo = s.Propiedad?.Titulo,
        ClienteId = s.ClienteId,
        ClienteNombre = s.Cliente?.NombreCompleto,
        FechaSugerida = s.FechaSugerida,
        Horario = s.Horario,
        Estado = s.Estado,
        FechaCreacion = s.FechaCreacion
    };
}
