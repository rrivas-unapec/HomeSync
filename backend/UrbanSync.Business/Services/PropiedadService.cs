using System.Text.Json;
using UrbanSync.Business.DTOs;
using UrbanSync.Business.Exceptions;
using UrbanSync.Business.Interfaces;
using UrbanSync.DataAccess.Repositories;
using UrbanSync.Domain.Common;
using UrbanSync.Domain.Entities;

namespace UrbanSync.Business.Services;

public class PropiedadService : IPropiedadService
{
    private readonly IPropiedadRepository _propiedadRepository;
    private readonly IAuditoriaPropiedadRepository _auditoriaRepository;

    private static readonly string[] TiposValidos = { TipoPropiedad.Alquiler, TipoPropiedad.Venta };
    private static readonly string[] EstadosValidos =
        { EstadoPropiedad.Disponible, EstadoPropiedad.Reservada, EstadoPropiedad.Inactiva };

    public PropiedadService(IPropiedadRepository propiedadRepository, IAuditoriaPropiedadRepository auditoriaRepository)
    {
        _propiedadRepository = propiedadRepository;
        _auditoriaRepository = auditoriaRepository;
    }

    public async Task<IReadOnlyList<PropiedadDto>> BuscarAsync(PropiedadFiltroDto filtro)
    {
        var propiedades = await _propiedadRepository.BuscarAsync(new FiltroPropiedades
        {
            Tipo = filtro.Tipo,
            Zona = filtro.Zona,
            PrecioMinimo = filtro.PrecioMinimo,
            PrecioMaximo = filtro.PrecioMaximo
        });

        return propiedades.Select(MapearDto).ToList();
    }

    public async Task<PropiedadDto> ObtenerPorIdAsync(int id)
    {
        var propiedad = await _propiedadRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe la propiedad con id {id}.");

        return MapearDto(propiedad);
    }

    public async Task<PropiedadDto> CrearAsync(PropiedadCreateDto dto, int usuarioId)
    {
        ValidarTipo(dto.Tipo);

        var propiedad = new Propiedad
        {
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            Tipo = dto.Tipo,
            Precio = dto.Precio,
            UbicacionZona = dto.UbicacionZona,
            Habitaciones = dto.Habitaciones,
            Banos = dto.Banos,
            Parqueos = dto.Parqueos,
            FotoUrl = dto.FotoUrl,
            Estado = EstadoPropiedad.Disponible,
            FechaCreacion = DateTime.UtcNow
        };

        await _propiedadRepository.AddAsync(propiedad);
        await _propiedadRepository.SaveChangesAsync();

        await RegistrarAuditoriaAsync(propiedad.Id, usuarioId, AccionAuditoria.Creacion, dto);

        return MapearDto(propiedad);
    }

    public async Task<PropiedadDto> ActualizarAsync(int id, PropiedadUpdateDto dto, int usuarioId)
    {
        ValidarTipo(dto.Tipo);
        ValidarEstado(dto.Estado);

        var propiedad = await _propiedadRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe la propiedad con id {id}.");

        propiedad.Titulo = dto.Titulo;
        propiedad.Descripcion = dto.Descripcion;
        propiedad.Tipo = dto.Tipo;
        propiedad.Precio = dto.Precio;
        propiedad.UbicacionZona = dto.UbicacionZona;
        propiedad.Habitaciones = dto.Habitaciones;
        propiedad.Banos = dto.Banos;
        propiedad.Parqueos = dto.Parqueos;
        propiedad.FotoUrl = dto.FotoUrl;
        propiedad.Estado = dto.Estado;

        _propiedadRepository.Update(propiedad);
        await _propiedadRepository.SaveChangesAsync();

        await RegistrarAuditoriaAsync(propiedad.Id, usuarioId, AccionAuditoria.Edicion, dto);

        return MapearDto(propiedad);
    }

    public async Task EliminarAsync(int id, int usuarioId)
    {
        var propiedad = await _propiedadRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe la propiedad con id {id}.");

        _propiedadRepository.Remove(propiedad);
        await _propiedadRepository.SaveChangesAsync();

        await RegistrarAuditoriaAsync(id, usuarioId, AccionAuditoria.Eliminacion, new { propiedad.Titulo });
    }

    private async Task RegistrarAuditoriaAsync(int propiedadId, int usuarioId, string accion, object detalle)
    {
        var auditoria = new AuditoriaPropiedad
        {
            PropiedadId = propiedadId,
            UsuarioId = usuarioId,
            Accion = accion,
            DetallesCambio = JsonSerializer.Serialize(detalle),
            FechaOperacion = DateTime.UtcNow
        };

        await _auditoriaRepository.AddAsync(auditoria);
        await _auditoriaRepository.SaveChangesAsync();
    }

    private static void ValidarTipo(string tipo)
    {
        if (!TiposValidos.Contains(tipo))
            throw new BusinessException($"Tipo invalido. Valores permitidos: {string.Join(", ", TiposValidos)}.");
    }

    private static void ValidarEstado(string estado)
    {
        if (!EstadosValidos.Contains(estado))
            throw new BusinessException($"Estado invalido. Valores permitidos: {string.Join(", ", EstadosValidos)}.");
    }

    private static PropiedadDto MapearDto(Propiedad p) => new()
    {
        Id = p.Id,
        Titulo = p.Titulo,
        Descripcion = p.Descripcion,
        Tipo = p.Tipo,
        Precio = p.Precio,
        UbicacionZona = p.UbicacionZona,
        Habitaciones = p.Habitaciones,
        Banos = p.Banos,
        Parqueos = p.Parqueos,
        FotoUrl = p.FotoUrl,
        Estado = p.Estado,
        FechaCreacion = p.FechaCreacion
    };
}
