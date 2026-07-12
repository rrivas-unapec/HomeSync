using Microsoft.AspNetCore.Mvc;

namespace HomeSync.Api.Controllers;

[ApiController]
[Route("api/propiedades")]
public sealed class PropiedadesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var propiedades = new[]
        {
            new
            {
                id = 1,
                titulo = "Apartamento moderno en Piantini",
                tipo = "Alquiler",
                precio = 65000,
                ubicacion = "Piantini, Santo Domingo",
                habitaciones = 3,
                banos = 2,
                parqueos = 2,
                estado = "Disponible"
            },
            new
            {
                id = 2,
                titulo = "Casa familiar en Santo Domingo Este",
                tipo = "Venta",
                precio = 8500000,
                ubicacion = "Santo Domingo Este",
                habitaciones = 4,
                banos = 3,
                parqueos = 2,
                estado = "Disponible"
            }
        };

        return Ok(propiedades);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        if (id != 1)
        {
            return NotFound(new
            {
                message = $"No se encontró la propiedad con ID {id}."
            });
        }

        return Ok(new
        {
            id = 1,
            titulo = "Apartamento moderno en Piantini",
            tipo = "Alquiler",
            precio = 65000,
            ubicacion = "Piantini, Santo Domingo",
            habitaciones = 3,
            banos = 2,
            parqueos = 2,
            estado = "Disponible"
        });
    }
}