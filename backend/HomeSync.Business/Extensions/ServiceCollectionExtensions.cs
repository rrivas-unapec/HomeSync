using Microsoft.Extensions.DependencyInjection;
using HomeSync.Business.Interfaces;
using HomeSync.Business.Services;

namespace HomeSync.Business.Extensions;

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
        services.AddScoped<IAuditoriaService, AuditoriaService>();

        return services;
    }
}
