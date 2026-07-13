USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'homesync_app')
    EXEC(N'CREATE LOGIN [homesync_app]
             WITH PASSWORD = ''$(AppPassword)'',
                  CHECK_POLICY = ON,
                  CHECK_EXPIRATION = OFF,
                  DEFAULT_DATABASE = [HomeSync];');
GO

USE HomeSync;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'homesync_app')
    CREATE USER [homesync_app] FOR LOGIN [homesync_app];
GO

ALTER ROLE [db_datareader] ADD MEMBER [homesync_app];
ALTER ROLE [db_datawriter] ADD MEMBER [homesync_app];
GO

PRINT 'Usuario de aplicacion homesync_app listo (solo lectura y escritura de datos).';
GO
