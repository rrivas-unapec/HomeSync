namespace UrbanSync.Business.Exceptions;

/// <summary>Se lanza ante violaciones de reglas de negocio. El middleware de la Api la traduce a 400.</summary>
public class BusinessException : Exception
{
    public BusinessException(string message) : base(message) { }
}
