# RBAC

Authentication is server-side JWT verification. Authorization has two layers: route-role compatibility for legacy endpoints and `requirePermission(...)` for action-level permissions. Built-in roles map to permission grants; user-level permissions extend those grants. `admin`, `SUPER_ADMIN`, and `INSTITUTION_ADMIN` have full access.

New endpoints must use `protect` and `requirePermission`, then apply an institution filter to every read and mutation. Button visibility in the client is only a convenience and is not authorization.
