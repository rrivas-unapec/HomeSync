using UrbanSync.Domain.Entities;

namespace UrbanSync.Business.Interfaces;

public interface IJwtService
{
    (string Token, DateTime ExpiraEn) GenerarToken(Usuario usuario);
}
