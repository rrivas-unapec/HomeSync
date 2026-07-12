using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuarios");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(u => u.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
        builder.Property(u => u.Correo).HasColumnName("correo").HasMaxLength(150).IsRequired();
        builder.Property(u => u.ContrasenaHash).HasColumnName("contrasenahash").HasMaxLength(255).IsRequired();
        builder.Property(u => u.Rol).HasColumnName("rol").HasMaxLength(20).IsRequired();
        builder.Property(u => u.FechaCreacion).HasColumnName("fechacreacion").HasDefaultValueSql("getdate()");

        builder.HasIndex(u => u.Correo).IsUnique();
    }
}
