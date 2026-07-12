using HomeSync.Domain.Entities;

namespace HomeSync.Business.Interfaces;

public interface IJwtService
{
    (string Token, DateTime ExpiraEn) GenerarToken(Usuario usuario);
}
