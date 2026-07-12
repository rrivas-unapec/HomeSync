using UrbanSync.Business.DTOs;
using UrbanSync.Business.Exceptions;
using UrbanSync.Business.Interfaces;
using UrbanSync.DataAccess.Repositories;
using UrbanSync.Domain.Entities;

namespace UrbanSync.Business.Services;

public class ClienteService : IClienteService
{
    private readonly IClienteRepository _clienteRepository;

    public ClienteService(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public async Task<IReadOnlyList<ClienteDto>> ObtenerTodosAsync()
    {
        var clientes = await _clienteRepository.GetAllAsync();
        return clientes.Select(MapearDto).ToList();
    }

    public async Task<ClienteDto> ObtenerPorIdAsync(int id)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe el cliente con id {id}.");

        return MapearDto(cliente);
    }

    public async Task<ClienteDto> CrearAsync(ClienteCreateDto dto)
    {
        var existente = await _clienteRepository.GetByCorreoAsync(dto.Correo);
        if (existente is not null)
            throw new BusinessException("Ya existe un cliente registrado con ese correo.");

        var cliente = new Cliente
        {
            NombreCompleto = dto.NombreCompleto,
            Correo = dto.Correo,
            Telefono = dto.Telefono,
            FechaRegistro = DateTime.UtcNow
        };

        await _clienteRepository.AddAsync(cliente);
        await _clienteRepository.SaveChangesAsync();

        return MapearDto(cliente);
    }

    public async Task<ClienteDto> ActualizarAsync(int id, ClienteUpdateDto dto)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"No existe el cliente con id {id}.");

        if (!string.IsNullOrWhiteSpace(dto.NombreCompleto))
            cliente.NombreCompleto = dto.NombreCompleto;

        if (dto.Telefono is not null)
            cliente.Telefono = dto.Telefono;

        _clienteRepository.Update(cliente);
        await _clienteRepository.SaveChangesAsync();

        return MapearDto(cliente);
    }

    private static ClienteDto MapearDto(Cliente c) => new()
    {
        Id = c.Id,
        NombreCompleto = c.NombreCompleto,
        Correo = c.Correo,
        Telefono = c.Telefono,
        FechaRegistro = c.FechaRegistro
    };
}
