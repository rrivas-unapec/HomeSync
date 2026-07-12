namespace UrbanSync.Business.Exceptions;

/// <summary>Se lanza ante credenciales invalidas. El middleware de la Api la traduce a 401.</summary>
public class UnauthorizedBusinessException : Exception
{
    public UnauthorizedBusinessException(string message) : base(message) { }
}
