using Microsoft.Extensions.DependencyInjection;
using UrbanSync.Business.Interfaces;
using UrbanSync.Business.Services;

namespace UrbanSync.Business.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBusiness(this IServiceCollection services)
    {
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IPropiedadService, PropiedadService>();
        services.AddScoped<ISolicitudDeVisitaService, SolicitudDeVisitaService>();
        services.AddScoped<IReporteService, ReporteService>();

        return services;
    }
}
