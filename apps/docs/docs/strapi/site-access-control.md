---
sidebar_position: 9
---

# Site access control

Admin users can be assigned to one Site through the `Site user assignment` collection type. The Site's `maxUsers` field sets its assignment limit. Set this limit before creating assignments; lowering it below the current number of assignments is rejected.

The assignment relates a Site to a Strapi admin user (`admin::user`). An admin user may be assigned to more than one Site, but duplicate assignments to the same Site are rejected. Super Admins can create, read, update, and delete assignments and change `maxUsers`.

The `Site Manager` admin role can create, read, update, and delete records that have a direct `site` relation for assigned Sites. It can read and update the assigned Site, but it cannot create or delete Sites, change `maxUsers`, or modify assignments. The `site` relation is available during record creation and is read-only during updates.

Site-scoped content types are Page, Portfolio project, Legal page, Form definition, and Subscriber. Other content types are not granted by the Site Manager role. The scope is enforced by Strapi admin RBAC conditions registered at startup, so assigning only the role without a Site user assignment provides no access to these scoped records.

The role and collection type are tracked in `apps/strapi/config/sync`. After deploying the schema and config changes, allow Strapi to restart and synchronize configuration. Then set each Site's `maxUsers`, create assignments, and assign the `Site Manager` role to the relevant admin users.
