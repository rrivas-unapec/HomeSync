using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Configurations;

public class SolicitudDeVisitaConfiguration : IEntityTypeConfiguration<SolicitudDeVisita>
{
    public void Configure(EntityTypeBuilder<SolicitudDeVisita> builder)
    {
        builder.ToTable("solicitudesdevisita");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(s => s.PropiedadId).HasColumnName("propiedadid").IsRequired();
        builder.Property(s => s.ClienteId).HasColumnName("clienteid").IsRequired();
        builder.Property(s => s.FechaSugerida).HasColumnName("fechasugerida").HasColumnType("date").IsRequired();
        builder.Property(s => s.Horario).HasColumnName("horario").HasMaxLength(10).IsRequired();
        builder.Property(s => s.Estado).HasColumnName("estado").HasMaxLength(15).HasDefaultValue("pendiente");
        builder.Property(s => s.FechaCreacion).HasColumnName("fechacreacion").HasDefaultValueSql("getdate()");

        builder.HasOne(s => s.Propiedad)
               .WithMany(p => p.Solicitudes)
               .HasForeignKey(s => s.PropiedadId)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(s => s.Cliente)
               .WithMany(c => c.Solicitudes)
               .HasForeignKey(s => s.ClienteId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
