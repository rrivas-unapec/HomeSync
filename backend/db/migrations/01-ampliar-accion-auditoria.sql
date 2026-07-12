USE HomeSync;
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
ELSE
  BEGIN
      PRINT 'auditoriapropiedades.accion ya admite 15 caracteres. Nada que hacer.';
  END
GO
