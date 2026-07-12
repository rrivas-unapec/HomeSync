namespace HomeSync.Business.Exceptions;

/// <summary>Se lanza cuando una entidad solicitada no existe. El middleware de la Api la traduce a 404.</summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}
