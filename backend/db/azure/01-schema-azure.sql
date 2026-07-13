IF OBJECT_ID(N'[dbo].[usuarios]', N'U') IS NULL
  BEGIN
      CREATE TABLE [dbo].[usuarios]
        (
           [id]             INT IDENTITY(1, 1) NOT NULL,
           [nombre]         VARCHAR(100) NOT NULL,
           [correo]         VARCHAR(150) NOT NULL,
           [contrasenahash] VARCHAR(255) NOT NULL,
           [rol]            VARCHAR(20) NOT NULL,
           [fechacreacion]  DATETIME NOT NULL CONSTRAINT [DF_Usuarios_FechaCreacion] DEFAULT (Getdate()),
           CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED ([id] ASC),
           CONSTRAINT [UQ_Usuarios_Correo] UNIQUE ([correo]),
           CONSTRAINT [CHK_Usuario_Rol] CHECK ([rol] IN ('administrador', 'cliente'))
        );
  END
GO

IF OBJECT_ID(N'[dbo].[clientes]', N'U') IS NULL
  BEGIN
      CREATE TABLE [dbo].[clientes]
        (
           [id]             INT IDENTITY(1, 1) NOT NULL,
           [nombrecompleto] VARCHAR(150) NOT NULL,
           [correo]         VARCHAR(150) NOT NULL,
           [telefono]       VARCHAR(20) NULL,
           [fecharegistro]  DATETIME NOT NULL CONSTRAINT [DF_Clientes_FechaRegistro] DEFAULT (Getdate()),
           CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([id] ASC),
           CONSTRAINT [UQ_Clientes_Correo] UNIQUE ([correo])
        );
  END
GO

IF OBJECT_ID(N'[dbo].[propiedades]', N'U') IS NULL
  BEGIN
      CREATE TABLE [dbo].[propiedades]
        (
           [id]            INT IDENTITY(1, 1) NOT NULL,
           [titulo]        VARCHAR(150) NOT NULL,
           [descripcion]   VARCHAR(MAX) NULL,
           [tipo]          VARCHAR(10) NOT NULL,
           [precio]        DECIMAL(18, 2) NOT NULL,
           [ubicacionzona] VARCHAR(100) NOT NULL,
           [habitaciones]  INT NOT NULL CONSTRAINT [DF_Propiedades_Habitaciones] DEFAULT (0),
           [banos]         INT NOT NULL CONSTRAINT [DF_Propiedades_Banos] DEFAULT (0),
           [parqueos]      INT NOT NULL CONSTRAINT [DF_Propiedades_Parqueos] DEFAULT (0),
           [fotourl]       VARCHAR(500) NULL,
           [estado]        VARCHAR(15) NOT NULL CONSTRAINT [DF_Propiedades_Estado] DEFAULT ('disponible'),
           [fechacreacion] DATETIME NOT NULL CONSTRAINT [DF_Propiedades_FechaCreacion] DEFAULT (Getdate()),
           CONSTRAINT [PK_Propiedades] PRIMARY KEY CLUSTERED ([id] ASC),
           CONSTRAINT [CHK_Propiedad_Tipo] CHECK ([tipo] IN ('alquiler', 'venta')),
           CONSTRAINT [CHK_Propiedad_Estado] CHECK ([estado] IN ('disponible', 'reservada', 'inactiva'))
        );
  END
GO

IF OBJECT_ID(N'[dbo].[solicitudesdevisita]', N'U') IS NULL
  BEGIN
      CREATE TABLE [dbo].[solicitudesdevisita]
        (
           [id]            INT IDENTITY(1, 1) NOT NULL,
           [propiedadid]   INT NOT NULL,
           [clienteid]     INT NOT NULL,
           [fechasugerida] DATE NOT NULL,
           [horario]       VARCHAR(10) NOT NULL,
           [estado]        VARCHAR(15) NOT NULL CONSTRAINT [DF_Solicitudes_Estado] DEFAULT ('pendiente'),
           [fechacreacion] DATETIME NOT NULL CONSTRAINT [DF_Solicitudes_FechaCreacion] DEFAULT (Getdate()),
           CONSTRAINT [PK_SolicitudesDeVisita] PRIMARY KEY CLUSTERED ([id] ASC),
           CONSTRAINT [CHK_Solicitud_Horario] CHECK ([horario] IN ('manana', 'tarde')),
           CONSTRAINT [CHK_Solicitud_Estado] CHECK ([estado] IN ('pendiente', 'confirmada', 'completada')),
           CONSTRAINT [FK_Solicitudes_Propiedades] FOREIGN KEY ([propiedadid])
             REFERENCES [dbo].[propiedades] ([id]),
           CONSTRAINT [FK_Solicitudes_Clientes] FOREIGN KEY ([clienteid])
             REFERENCES [dbo].[clientes] ([id]) ON DELETE CASCADE
        );
  END
GO

IF OBJECT_ID(N'[dbo].[auditoriapropiedades]', N'U') IS NULL
  BEGIN
      CREATE TABLE [dbo].[auditoriapropiedades]
        (
           [id]             INT IDENTITY(1, 1) NOT NULL,
           [propiedadid]    INT NOT NULL,
           [usuarioid]      INT NULL,
           [accion]         VARCHAR(15) NOT NULL,
           [detallescambio] VARCHAR(MAX) NULL,
           [fechaoperacion] DATETIME NOT NULL CONSTRAINT [DF_Auditoria_FechaOperacion] DEFAULT (Getdate()),
           CONSTRAINT [PK_AuditoriaPropiedades] PRIMARY KEY CLUSTERED ([id] ASC),
           CONSTRAINT [CHK_Auditoria_Accion] CHECK ([accion] IN ('CREACION', 'EDICION', 'ELIMINACION')),
           CONSTRAINT [FK_Auditoria_Usuarios] FOREIGN KEY ([usuarioid])
             REFERENCES [dbo].[usuarios] ([id]) ON DELETE SET NULL
        );
  END
GO

IF EXISTS (SELECT 1
           FROM   sys.columns
           WHERE  object_id = OBJECT_ID(N'[dbo].[auditoriapropiedades]')
                  AND name = N'accion'
                  AND max_length < 15)
  BEGIN
      DECLARE @check SYSNAME;

      SELECT @check = name
      FROM   sys.check_constraints
      WHERE  parent_object_id = OBJECT_ID(N'[dbo].[auditoriapropiedades]')
             AND OBJECT_DEFINITION(object_id) LIKE '%accion%';

      IF @check IS NOT NULL
          EXEC('ALTER TABLE [dbo].[auditoriapropiedades] DROP CONSTRAINT [' + @check + ']');

      ALTER TABLE [dbo].[auditoriapropiedades]
        ALTER COLUMN [accion] VARCHAR(15) NOT NULL;

      ALTER TABLE [dbo].[auditoriapropiedades]
        ADD CONSTRAINT [CHK_Auditoria_Accion]
        CHECK ([accion] IN ('CREACION', 'EDICION', 'ELIMINACION'));

      PRINT 'auditoriapropiedades.accion ampliada a VARCHAR(15).';
  END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_SolicitudesDeVisita_PropiedadId')
    CREATE INDEX [IX_SolicitudesDeVisita_PropiedadId] ON [dbo].[solicitudesdevisita]([propiedadid]);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_SolicitudesDeVisita_ClienteId')
    CREATE INDEX [IX_SolicitudesDeVisita_ClienteId] ON [dbo].[solicitudesdevisita]([clienteid]);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AuditoriaPropiedades_PropiedadId')
    CREATE INDEX [IX_AuditoriaPropiedades_PropiedadId] ON [dbo].[auditoriapropiedades]([propiedadid]);
GO

PRINT 'Esquema de HomeSync aplicado en Azure SQL Database.';
GO
