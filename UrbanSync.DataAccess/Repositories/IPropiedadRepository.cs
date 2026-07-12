using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Repositories;

public class FiltroPropiedades
{
    public string? Tipo { get; set; }
    public string? Zona { get; set; }
    public decimal? PrecioMinimo { get; set; }
    public decimal? PrecioMaximo { get; set; }
}

public interface IPropiedadRepository : IGenericRepository<Propiedad>
{
    Task<IReadOnlyList<Propiedad>> BuscarAsync(FiltroPropiedades filtro);
    Task<IReadOnlyList<(string Tipo, int Total)>> GetDistribucionPorTipoAsync();
}
