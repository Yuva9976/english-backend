PR note: feature/resource-migration-006

This branch adds `migrations/006_create_resource_type_and_resource_views.sql`.

Purpose: create `resource_type` enum and `resource_views` table.

Tests: Local Jest tests pass; migration ran locally via `node run_migration.js`.
