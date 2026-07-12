using Microsoft.EntityFrameworkCore;
using UrbanSync.DataAccess.Configurations;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Context;

public class UrbanSyncDbContext : DbContext
{
    public UrbanSyncDbContext(DbContextOptions<UrbanSyncDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Propiedad> Propiedades => Set<Propiedad>();
    public DbSet<SolicitudDeVisita> SolicitudesDeVisita => Set<SolicitudDeVisita>();
    public DbSet<AuditoriaPropiedad> AuditoriaPropiedades => Set<AuditoriaPropiedad>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
        modelBuilder.ApplyConfiguration(new ClienteConfiguration());
        modelBuilder.ApplyConfiguration(new PropiedadConfiguration());
        modelBuilder.ApplyConfiguration(new SolicitudDeVisitaConfiguration());
        modelBuilder.ApplyConfiguration(new AuditoriaPropiedadConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}
