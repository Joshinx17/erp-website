# CampusOS architecture

CampusOS currently uses a React/Vite client and Express/Mongoose API. The Phase 1 migration retains the existing stack while introducing institution, campus, and academic-year boundaries.

## Current boundary

Request authentication resolves a user first. New tenant-aware endpoints scope records to `req.user.institution`; setup creates the first Institution → Campus → AcademicYear hierarchy and attaches it to the configuring administrator.

## Migration direction

All new institutional records must include `institution`, `campus` when applicable, timestamps, actor metadata, and soft deletion when historical retention matters. Existing legacy records remain accessible only to unscoped legacy administrators until migrated. Subsequent phases should backfill them into an institution before enforcing a required tenant field globally.
