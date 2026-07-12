namespace HomeSync.Domain.Common;

/// <summary>
/// Constantes de dominio que reflejan los CHECK constraints definidos en la base de datos.
/// Se usan strings (no enums de C#) para que el valor persistido sea siempre
/// legible directamente en la base de datos, tal como lo exige el esquema SQL.
/// </summary>
public static class RolUsuario
{
    public const string Administrador = "administrador";
    public const string Cliente = "cliente";
}

public static class TipoPropiedad
{
    public const string Alquiler = "alquiler";
    public const string Venta = "venta";
}

public static class EstadoPropiedad
{
    public const string Disponible = "disponible";
    public const string Reservada = "reservada";
    public const string Inactiva = "inactiva";
}

public static class HorarioVisita
{
    public const string Manana = "manana";
    public const string Tarde = "tarde";
}

public static class EstadoSolicitud
{
    public const string Pendiente = "pendiente";
    public const string Confirmada = "confirmada";
    public const string Completada = "completada";
}

public static class AccionAuditoria
{
    public const string Creacion = "CREACION";
    public const string Edicion = "EDICION";
    public const string Eliminacion = "ELIMINACION";
}
