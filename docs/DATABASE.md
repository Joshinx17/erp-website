# Database notes

MongoDB is the existing persistence engine. Phase 1 adds `Institution`, `Campus`, and `AcademicYear` models. `User` now supports an institution, campus, expanded role set, explicit permissions, and last-login timestamp. Students support archival through `deletedAt` instead of physical deletion.

The legacy `Student`, `Teacher`, `Class`, and `Subject` models need a controlled backfill before tenant fields become required. Do not use globally unique student identifiers for a multi-institution system; compound indexes should be tenant-scoped in the next migration.
