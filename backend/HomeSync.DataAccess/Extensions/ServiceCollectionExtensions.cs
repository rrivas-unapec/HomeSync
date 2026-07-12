using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using HomeSync.DataAccess.Context;
using HomeSync.DataAccess.Repositories;

namespace HomeSync.DataAccess.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("HomeSyncConnection");

        services.AddDbContext<HomeSyncDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IClienteRepository, ClienteRepository>();
        services.AddScoped<IPropiedadRepository, PropiedadRepository>();
        services.AddScoped<ISolicitudDeVisitaRepository, SolicitudDeVisitaRepository>();
        services.AddScoped<IAuditoriaPropiedadRepository, AuditoriaPropiedadRepository>();

        return services;
    }
}
