-- lascia solo 0000_init nella tabella delle migrations
DELETE FROM "_prisma_migrations"
WHERE migration_name <> '0000_init';