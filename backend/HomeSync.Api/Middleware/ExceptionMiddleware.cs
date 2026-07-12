using System.Net;
using System.Text.Json;
using HomeSync.Business.Exceptions;

namespace HomeSync.Api.Middleware;

/// <summary>
/// Traduce las excepciones de negocio a respuestas HTTP consistentes,
/// evitando repetir try/catch en cada controlador.
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, mensaje) = ex switch
            {
                NotFoundException => (HttpStatusCode.NotFound, ex.Message),
                UnauthorizedBusinessException => (HttpStatusCode.Unauthorized, ex.Message),
                BusinessException => (HttpStatusCode.BadRequest, ex.Message),
                _ => (HttpStatusCode.InternalServerError, "Ocurrio un error inesperado en el servidor.")
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                _logger.LogError(ex, "Error no controlado");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var payload = JsonSerializer.Serialize(new { error = mensaje });
            await context.Response.WriteAsync(payload);
        }
    }
}
