using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrbanSync.Domain.Entities;

namespace UrbanSync.DataAccess.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.ToTable("clientes");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(c => c.NombreCompleto).HasColumnName("nombrecompleto").HasMaxLength(150).IsRequired();
        builder.Property(c => c.Correo).HasColumnName("correo").HasMaxLength(150).IsRequired();
        builder.Property(c => c.Telefono).HasColumnName("telefono").HasMaxLength(20);
        builder.Property(c => c.FechaRegistro).HasColumnName("fecharegistro").HasDefaultValueSql("getdate()");

        builder.HasIndex(c => c.Correo).IsUnique();
    }
}
