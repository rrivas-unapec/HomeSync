using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Configurations;

public class PropiedadConfiguration : IEntityTypeConfiguration<Propiedad>
{
    public void Configure(EntityTypeBuilder<Propiedad> builder)
    {
        builder.ToTable("propiedades");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(p => p.Titulo).HasColumnName("titulo").HasMaxLength(150).IsRequired();
        builder.Property(p => p.Descripcion).HasColumnName("descripcion").HasColumnType("text");
        builder.Property(p => p.Tipo).HasColumnName("tipo").HasMaxLength(10).IsRequired();
        builder.Property(p => p.Precio).HasColumnName("precio").HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(p => p.UbicacionZona).HasColumnName("ubicacionzona").HasMaxLength(100).IsRequired();
        builder.Property(p => p.Habitaciones).HasColumnName("habitaciones").HasDefaultValue(0);
        builder.Property(p => p.Banos).HasColumnName("banos").HasDefaultValue(0);
        builder.Property(p => p.Parqueos).HasColumnName("parqueos").HasDefaultValue(0);
        builder.Property(p => p.FotoUrl).HasColumnName("fotourl").HasMaxLength(500);
        builder.Property(p => p.Estado).HasColumnName("estado").HasMaxLength(15).HasDefaultValue("disponible");
        builder.Property(p => p.FechaCreacion).HasColumnName("fechacreacion").HasDefaultValueSql("getdate()");
    }
}
