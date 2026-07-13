using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HomeSync.Domain.Entities;

namespace HomeSync.DataAccess.Configurations;

public class AuditoriaPropiedadConfiguration : IEntityTypeConfiguration<AuditoriaPropiedad>
{
    public void Configure(EntityTypeBuilder<AuditoriaPropiedad> builder)
    {
        builder.ToTable("auditoriapropiedades");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(a => a.PropiedadId).HasColumnName("propiedadid").IsRequired();
        builder.Property(a => a.UsuarioId).HasColumnName("usuarioid");
        builder.Property(a => a.Accion).HasColumnName("accion").HasMaxLength(15).IsRequired();
        builder.Property(a => a.DetallesCambio).HasColumnName("detallescambio").HasColumnType("text");
        builder.Property(a => a.FechaOperacion).HasColumnName("fechaoperacion").HasDefaultValueSql("getdate()");

        // El script SQL no declara una FK fisica de PropiedadId -> Propiedades en esta
        // tabla (solo existe FK_Auditoria_Usuarios). Se mapea igual la navegacion para
        // poder hacer Include()/joins desde EF, sin que EF intente crear la constraint
        // (no se generan migraciones contra esta base, es Database First).
        builder.HasOne(a => a.Propiedad)
               .WithMany(p => p.Auditorias)
               .HasForeignKey(a => a.PropiedadId)
               .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(a => a.Usuario)
               .WithMany(u => u.Auditorias)
               .HasForeignKey(a => a.UsuarioId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
