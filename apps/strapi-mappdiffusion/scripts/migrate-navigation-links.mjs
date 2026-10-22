import pg from 'pg';
import process from 'node:process';

const { Client } = pg;

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

async function getLegacyNavigationEntities(client) {
  const result = await client.query(`
    SELECT DISTINCT entity_id
    FROM navigation_layouts_cmps
    WHERE component_type = 'component.nav-item'
      AND field = 'items'
    ORDER BY entity_id
  `);

  return result.rows.map((row) => row.entity_id);
}

async function getLegacyNavRows(client, entityId) {
  const result = await client.query(
    `
      SELECT
        nlc.id AS link_row_id,
        nlc.entity_id,
        nlc.cmp_id,
        nlc."order" AS sort_order,
        ni.label,
        ni.href,
        ni.is_external
      FROM navigation_layouts_cmps nlc
      JOIN components_component_nav_items ni
        ON ni.id = nlc.cmp_id
      WHERE nlc.entity_id = $1
        AND nlc.component_type = 'component.nav-item'
        AND nlc.field = 'items'
      ORDER BY nlc."order" ASC, nlc.id ASC
    `,
    [entityId]
  );

  return result.rows;
}

async function getLegacyChildren(client, navItemId) {
  const result = await client.query(
    `
      SELECT
        nic."order" AS sort_order,
        child.label,
        child.href,
        child.is_external
      FROM components_component_nav_items_cmps nic
      JOIN components_component_nav_item_children child
        ON child.id = nic.cmp_id
      WHERE nic.entity_id = $1
        AND nic.component_type = 'component.nav-item-child'
        AND nic.field = 'dropdown'
      ORDER BY nic."order" ASC, nic.id ASC
    `,
    [navItemId]
  );

  return result.rows;
}

async function buildFlatLinks(client, entityId) {
  const navRows = await getLegacyNavRows(client, entityId);
  const flatLinks = [];

  for (const navRow of navRows) {
    if (navRow.href) {
      flatLinks.push({
        label: navRow.label,
        href: navRow.href,
        isExternal: navRow.is_external,
      });
      continue;
    }

    const children = await getLegacyChildren(client, navRow.cmp_id);
    for (const child of children) {
      flatLinks.push({
        label: child.label,
        href: child.href,
        isExternal: child.is_external,
      });
    }
  }

  return flatLinks;
}

async function migrateEntity(client, entityId) {
  const flatLinks = await buildFlatLinks(client, entityId);

  if (flatLinks.length === 0) {
    console.log(`[navigation-link-migration] entity ${entityId} has no migratable links`);
    return { created: 0 };
  }

  await client.query('BEGIN');

  try {
    await client.query(
      `
        DELETE FROM navigation_layouts_cmps
        WHERE entity_id = $1
          AND field = 'items'
      `,
      [entityId]
    );

    let order = 1;
    for (const link of flatLinks) {
      const linkInsert = await client.query(
        `
          INSERT INTO components_component_links (href, is_external, label)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [link.href, link.isExternal ?? false, link.label]
      );

      const linkId = linkInsert.rows[0]?.id;

      await client.query(
        `
          INSERT INTO navigation_layouts_cmps (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'component.link', 'items', $3)
        `,
        [entityId, linkId, order]
      );

      order += 1;
    }

    await client.query(
      `
        UPDATE navigation_layouts
        SET updated_at = NOW()
        WHERE id = $1
      `,
      [entityId]
    );

    await client.query('COMMIT');
    console.log(
      `[navigation-link-migration] entity ${entityId} migrated ${flatLinks.length} link(s)`
    );
    return { created: flatLinks.length };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

async function main() {
  const client = new Client({
    host: env('DATABASE_HOST', '127.0.0.1'),
    port: Number(env('DATABASE_PORT', '5432')),
    database: env('DATABASE_NAME'),
    user: env('DATABASE_USERNAME'),
    password: env('DATABASE_PASSWORD'),
    ssl: env('DATABASE_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
  });

  if (!env('DATABASE_NAME')) {
    throw new Error('DATABASE_NAME is required');
  }

  await client.connect();

  try {
    const entityIds = await getLegacyNavigationEntities(client);
    console.log(
      `[navigation-link-migration] found ${entityIds.length} navigation layout(s) using legacy nav-item components`
    );

    let migratedLayouts = 0;
    let migratedLinks = 0;

    for (const entityId of entityIds) {
      const result = await migrateEntity(client, entityId);
      if (result.created > 0) {
        migratedLayouts += 1;
        migratedLinks += result.created;
      }
    }

    console.log(
      `[navigation-link-migration] completed layouts=${migratedLayouts} links=${migratedLinks}`
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[navigation-link-migration] fatal:', error);
  process.exitCode = 1;
});
