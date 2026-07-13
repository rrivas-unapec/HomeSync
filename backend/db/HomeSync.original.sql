IF NOT EXISTS (SELECT NAME
               FROM   sys.databases
               WHERE  NAME = N'HomeSync')
  BEGIN
      CREATE DATABASE homesync;
  END

go

USE homesync;

go

IF NOT EXISTS (SELECT *
               FROM   sys.objects
               WHERE  object_id = Object_id(N'[dbo].[Usuarios]')
                      AND type IN ( N'U' ))
  BEGIN
      CREATE TABLE [dbo].[usuarios]
        (
           [id]             INT IDENTITY(1, 1) NOT NULL,
           [nombre]         VARCHAR(100) NOT NULL,
           [correo]         VARCHAR(150) NOT NULL UNIQUE,
           [contrasenahash] VARCHAR(255) NOT NULL,
           [rol]            VARCHAR(20) NOT NULL CONSTRAINT chk_usuario_rol
           CHECK
           (
           [rol] IN (
           'administrador', 'cliente')
           ),
           [fechacreacion]  DATETIME DEFAULT Getdate() NOT NULL,
           CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED ([id] ASC)
        );
  END

go

IF NOT EXISTS (SELECT *
               FROM   sys.objects
               WHERE  object_id = Object_id(N'[dbo].[Clientes]')
                      AND type IN ( N'U' ))
  BEGIN
      CREATE TABLE [dbo].[clientes]
        (
           [id]             INT IDENTITY(1, 1) NOT NULL,
           [nombrecompleto] VARCHAR(150) NOT NULL,
           [correo]         VARCHAR(150) NOT NULL UNIQUE,
           [telefono]       VARCHAR(20) NULL,
           [fecharegistro]  DATETIME DEFAULT Getdate() NOT NULL,
           CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([id] ASC)
        );
  END

go

IF NOT EXISTS (SELECT *
               FROM   sys.objects
               WHERE  object_id = Object_id(N'[dbo].[Propiedades]')
                      AND type IN ( N'U' ))
  BEGIN
      CREATE TABLE [dbo].[propiedades]
        (
           [id]            INT IDENTITY(1, 1) NOT NULL,
           [titulo]        VARCHAR(150) NOT NULL,
           [descripcion]   TEXT NULL,
           [tipo]          VARCHAR(10) NOT NULL CONSTRAINT chk_propiedad_tipo
           CHECK (
           [tipo] IN (
           'alquiler', 'venta')),
           [precio]        DECIMAL(18, 2) NOT NULL,
           [ubicacionzona] VARCHAR(100) NOT NULL,
           [habitaciones]  INT DEFAULT 0 NOT NULL,
           [banos]         INT DEFAULT 0 NOT NULL,
           [parqueos]      INT DEFAULT 0 NOT NULL,
           [fotourl]       VARCHAR(500) NULL,
           [estado]        VARCHAR(15) DEFAULT 'disponible' NOT NULL CONSTRAINT
           chk_propiedad_estado CHECK ([estado] IN
           ('disponible', 'reservada', 'inactiva')),
           [fechacreacion] DATETIME DEFAULT Getdate() NOT NULL,
           CONSTRAINT [PK_Propiedades] PRIMARY KEY CLUSTERED ([id] ASC)
        );
  END

go

IF NOT EXISTS (SELECT *
               FROM   sys.objects
               WHERE  object_id = Object_id(N'[dbo].[SolicitudesDeVisita]')
                      AND type IN ( N'U' ))
  BEGIN
      CREATE TABLE [dbo].[solicitudesdevisita]
        (
           [id]            INT IDENTITY(1, 1) NOT NULL,
           [propiedadid]   INT NOT NULL,
           [clienteid]     INT NOT NULL,
           [fechasugerida] DATE NOT NULL,
           [horario]       VARCHAR(10) NOT NULL CONSTRAINT chk_solicitud_horario
           CHECK
           ([horario]
           IN ('manana', 'tarde'
           )),
           [estado]        VARCHAR(15) DEFAULT 'pendiente' NOT NULL CONSTRAINT
           chk_solicitud_estado CHECK ([estado] IN
           ('pendiente', 'confirmada', 'completada')),
           [fechacreacion] DATETIME DEFAULT Getdate() NOT NULL,
           CONSTRAINT [PK_SolicitudesDeVisita] PRIMARY KEY CLUSTERED ([id] ASC),
           CONSTRAINT [FK_Solicitudes_Propiedades] FOREIGN KEY ([propiedadid])
           REFERENCES [dbo].[propiedades] ([id]),
           CONSTRAINT [FK_Solicitudes_Clientes] FOREIGN KEY ([clienteid])
           REFERENCES
           [dbo].[clientes] ([id]) ON DELETE CASCADE
        );
  END

go

IF NOT EXISTS (SELECT *
               FROM   sys.objects
               WHERE  object_id = Object_id(N'[dbo].[AuditoriaPropiedades]')
                      AND type IN ( N'U' ))
  BEGIN
      CREATE TABLE [dbo].[auditoriapropiedades]
        (
           [id]             INT IDENTITY(1, 1) NOT NULL,
           [propiedadid]    INT NOT NULL,
           [usuarioid]      INT NULL,
           [accion]         VARCHAR(10) NOT NULL CONSTRAINT chk_auditoria_accion
           CHECK
           ([accion] IN
           ('CREACION',
           'EDICION', 'ELIMINACION')),
           [detallescambio] TEXT NULL,
           [fechaoperacion] DATETIME DEFAULT Getdate() NOT NULL,
           CONSTRAINT [PK_AuditoriaPropiedades] PRIMARY KEY CLUSTERED ([id] ASC)
           ,
           CONSTRAINT [FK_Auditoria_Usuarios] FOREIGN KEY ([usuarioid])
           REFERENCES
           [dbo].[usuarios] ([id]) ON DELETE SET NULL
        );
  END

go 