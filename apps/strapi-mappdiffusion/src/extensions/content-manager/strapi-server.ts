// src/extensions/content-manager/strapi-server.ts
interface AdminUser {
  id: number;
  roles?: Array<{ code: string }>;
}

interface RequestBody {
  manager?: string;
  documentIds?: string[];
  [key: string]: unknown;
}

type RelationAttribute = {
  type?: string;
  target?: string;
};

type ManagerDocument = {
  documentId: string;
};

type ControllerContext = {
  params: Record<string, string>;
  request: {
    query: Record<string, unknown>;
    body?: RequestBody;
  };
  state: {
    user?: AdminUser;
    [key: string]: unknown;
  };
  forbidden: (message: string) => unknown;
  badRequest: (message: string, details?: Record<string, unknown>) => unknown;
};

type Controller = (this: unknown, ctx: ControllerContext) => unknown;

type ContentManagerPlugin = {
  controllers: {
    'collection-types': Record<string, Controller>;
    relations?: Partial<Record<'findAvailable' | 'findExisting', Controller>>;
  };
};

export default (plugin: ContentManagerPlugin) => {
  const MANAGED_MODELS = [
    'api::article.article',
    'api::card.card',
    'api::category.category',
    'api::faq.faq',
    'api::link.link',
    'api::resolution.resolution',
    'api::agenda-event.agenda-event',
    'api::servicio-item.servicio-item',
    'api::team-member.team-member',
    'api::contact.contact',
    'api::subscriber.subscriber',
    'api::edicto.edicto'
  ];

  const ONE_TO_ONE_MODELS = [
    'api::home-page.home-page',
    'api::footer-layout.footer-layout',
    'api::about-page.about-page',
    'api::theme-setting.theme-setting',
    'api::privacy-policies-page.privacy-policies-page',
    'api::terms-of-use-page.terms-of-use-page',
    'api::metadata.metadata',
    'api::navigation-layout.navigation-layout',
    'api::contact-page.contact-page'
  ];

  const ALL_MANAGED_MODELS = [...MANAGED_MODELS, ...ONE_TO_ONE_MODELS];
  const MANAGER_MODEL = 'api::manager.manager';

  const isSuperAdmin = (user?: AdminUser) =>
    Boolean(user?.roles?.some((role) => role.code === 'strapi-super-admin'));

  const getModelSchema = (uid: string) => strapi.getModel(uid as any) as any;

  const isManagerScopedModel = (uid: string) => {
    if (uid === MANAGER_MODEL) {
      return true;
    }

    const schema = getModelSchema(uid);
    const managerAttribute = schema?.attributes?.manager as RelationAttribute | undefined;

    return (
      managerAttribute?.type === 'relation' &&
      managerAttribute.target === MANAGER_MODEL
    );
  };

  const getRelationAttribute = (model: string, field: string) => {
    const schema = getModelSchema(model);
    return schema?.attributes?.[field] as RelationAttribute | undefined;
  };

  const parseFilters = (filters: unknown) => {
    if (!filters) {
      return {};
    }

    if (typeof filters === 'string') {
      try {
        return JSON.parse(filters);
      } catch (error) {
        strapi.log.error('Error parseando filtros:', error);
        return {};
      }
    }

    return typeof filters === 'object' ? filters : {};
  };

  const applyFilterClause = (ctx: ControllerContext, clause: Record<string, unknown>) => {
    if (!ctx.request.query) {
      ctx.request.query = {};
    }

    const existingFilters = parseFilters(ctx.request.query.filters);
    ctx.request.query.filters =
      Object.keys(existingFilters).length > 0
        ? { $and: [existingFilters, clause] }
        : clause;
  };

  const getUserManager = async (user: AdminUser): Promise<ManagerDocument | null> => {
    const managers = await strapi.documents(MANAGER_MODEL).findMany({
      filters: { admin_user: { id: user.id }, is_active: true },
      limit: 1
    });

    return managers?.[0] ?? null;
  };

  const assignManager = async (body: RequestBody, user: AdminUser, model: string) => {
    try {
      const manager = await getUserManager(user);

      if (manager) {
        body.manager = manager.documentId;
        strapi.log.info(`Manager impuesto en ${model}: ${manager.documentId}`);
        return manager;
      }

      strapi.log.warn(`No se encontró manager para usuario en ${model}`);
      return null;
    } catch (error) {
      strapi.log.error(`Error asignando manager a ${model}:`, error);
      return null;
    }
  };

  const checkOneToOneExists = async (model: string, managerId: string) => {
    try {
      const existing = await (strapi.documents(model as any) as any).findMany({
        filters: {
          manager: {
            documentId: managerId
          }
        },
        limit: 1
      });

      return existing?.[0] ?? null;
    } catch (error) {
      strapi.log.error(`Error verificando existencia de ${model}:`, error);
      return null;
    }
  };

  const getUniqueDocumentIds = (value: unknown): string[] => {
    const documentIds = new Set<string>();

    const visit = (node: unknown) => {
      if (typeof node === 'string' && node.trim()) {
        documentIds.add(node);
        return;
      }

      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }

      if (!node || typeof node !== 'object') {
        return;
      }

      const record = node as Record<string, unknown>;

      if (typeof record.documentId === 'string' && record.documentId.trim()) {
        documentIds.add(record.documentId);
      }

      if ('connect' in record) {
        visit(record.connect);
      }

      if ('set' in record) {
        visit(record.set);
      }

      if ('data' in record) {
        visit(record.data);
      }
    };

    visit(value);

    return [...documentIds];
  };

  const getOwnedDocumentIds = async (
    model: string,
    documentIds: string[],
    managerDocumentId: string
  ) => {
    const uniqueIds = [...new Set(documentIds.filter(Boolean))];

    if (uniqueIds.length === 0) {
      return [] as string[];
    }

    if (model === MANAGER_MODEL) {
      return uniqueIds.filter((documentId) => documentId === managerDocumentId);
    }

    if (!isManagerScopedModel(model)) {
      return uniqueIds;
    }

    const documents = await (strapi.documents(model as any) as any).findMany({
      filters: {
        documentId: { $in: uniqueIds },
        manager: { documentId: managerDocumentId }
      },
      limit: uniqueIds.length
    });

    return documents
      .map((document: { documentId?: unknown } | null | undefined) => document?.documentId)
      .filter((documentId: unknown): documentId is string => typeof documentId === 'string');
  };

  const assertOwnedDocument = async (
    ctx: ControllerContext,
    model: string,
    documentId: string | undefined,
    managerDocumentId: string,
    message: string
  ) => {
    if (!documentId) {
      return true;
    }

    const ownedDocumentIds = await getOwnedDocumentIds(
      model,
      [documentId],
      managerDocumentId
    );

    if (!ownedDocumentIds.includes(documentId)) {
      ctx.forbidden(message);
      return false;
    }

    return true;
  };

  const assertBulkDocumentsOwned = async (
    ctx: ControllerContext,
    model: string,
    documentIds: unknown,
    managerDocumentId: string,
    message: string
  ) => {
    const rawDocumentIds = Array.isArray(documentIds)
      ? documentIds
      : typeof documentIds === 'string'
        ? [documentIds]
        : [];

    const requestedDocumentIds = [
      ...new Set(
        rawDocumentIds.filter(
          (value): value is string =>
            typeof value === 'string' && value.trim().length > 0
        )
      )
    ];

    if (requestedDocumentIds.length === 0) {
      return true;
    }

    const ownedDocumentIds = await getOwnedDocumentIds(
      model,
      requestedDocumentIds,
      managerDocumentId
    );

    if (ownedDocumentIds.length !== requestedDocumentIds.length) {
      ctx.forbidden(message);
      return false;
    }

    return true;
  };

  const validateManagedRelations = async (
    model: string,
    body: RequestBody,
    managerDocumentId: string
  ) => {
    const schema = getModelSchema(model);

    if (!schema?.attributes) {
      return null;
    }

    for (const [field, attribute] of Object.entries(schema.attributes)) {
      const relationAttribute = attribute as RelationAttribute;

      if (relationAttribute?.type !== 'relation' || !relationAttribute.target) {
        continue;
      }

      if (!isManagerScopedModel(relationAttribute.target)) {
        continue;
      }

      const relatedDocumentIds = getUniqueDocumentIds(body[field]);

      if (relatedDocumentIds.length === 0) {
        continue;
      }

      const ownedDocumentIds = await getOwnedDocumentIds(
        relationAttribute.target,
        relatedDocumentIds,
        managerDocumentId
      );

      if (ownedDocumentIds.length !== relatedDocumentIds.length) {
        return `No tienes permiso para relacionar ${field} con registros de otro manager`;
      }
    }

    return null;
  };

  const enforceManagedMutation = async (
    ctx: ControllerContext,
    model: string,
    user: AdminUser,
    options?: { checkOneToOne?: boolean; currentDocumentId?: string }
  ) => {
    if (!ALL_MANAGED_MODELS.includes(model) || isSuperAdmin(user)) {
      return null;
    }

    const body = (ctx.request.body ?? {}) as RequestBody;
    const manager = await assignManager(body, user, model);

    if (!manager) {
      ctx.forbidden('No tienes un manager asignado');
      return false;
    }

    const relationError = await validateManagedRelations(
      model,
      body,
      manager.documentId
    );

    if (relationError) {
      ctx.forbidden(relationError);
      return false;
    }

    if (options?.checkOneToOne && ONE_TO_ONE_MODELS.includes(model)) {
      const existing = await checkOneToOneExists(model, manager.documentId);

      if (
        existing &&
        (!options.currentDocumentId || existing.documentId !== options.currentDocumentId)
      ) {
        ctx.badRequest(
          'Ya existe un registro de este tipo para tu manager. Solo puedes tener uno.',
          { existingDocumentId: existing.documentId }
        );
        return false;
      }
    }

    return manager;
  };

  const getManagerScopeFilter = (targetUid: string, managerDocumentId: string) => {
    if (targetUid === MANAGER_MODEL) {
      return { documentId: { $eq: managerDocumentId } };
    }

    return { manager: { documentId: { $eq: managerDocumentId } } };
  };

  const applyManagedRelationFilter = async (ctx: ControllerContext, user: AdminUser) => {
    const { model, targetField } = ctx.params;
    const relationAttribute = getRelationAttribute(model, targetField);

    if (
      isSuperAdmin(user) ||
      relationAttribute?.type !== 'relation' ||
      !relationAttribute.target ||
      !isManagerScopedModel(relationAttribute.target)
    ) {
      return null;
    }

    const manager = await getUserManager(user);

    if (!manager) {
      applyFilterClause(ctx, { documentId: { $eq: 'no-match' } });
      return null;
    }

    applyFilterClause(
      ctx,
      getManagerScopeFilter(relationAttribute.target, manager.documentId)
    );

    return manager;
  };

  const enforceManagedSourceDocumentAccess = async (ctx: ControllerContext, user: AdminUser) => {
    const { model } = ctx.params;

    if (!ALL_MANAGED_MODELS.includes(model) || isSuperAdmin(user)) {
      return null;
    }

    const manager = await getUserManager(user);

    if (!manager) {
      ctx.forbidden('No tienes un manager asignado');
      return false;
    }

    const sourceDocumentId = ctx.params.id ?? ctx.request?.query?.id;

    const hasAccess = await assertOwnedDocument(
      ctx,
      model,
      sourceDocumentId,
      manager.documentId,
      'No tienes permiso para acceder a las relaciones de este registro'
    );

    return hasAccess ? manager : false;
  };

  const shouldGuardManagedModel = (model: string, user?: AdminUser) =>
    Boolean(user && !isSuperAdmin(user) && ALL_MANAGED_MODELS.includes(model));

  const getManagerOrDeny = async (ctx: ControllerContext, user: AdminUser) => {
    const manager = await getUserManager(user);

    if (!manager) {
      ctx.forbidden('No tienes un manager asignado');
      return null;
    }

    return manager;
  };

  const guardSingleDocumentAccess = async (
    ctx: ControllerContext,
    model: string,
    user: AdminUser,
    documentId: string | undefined,
    message: string
  ) => {
    const manager = await getManagerOrDeny(ctx, user);

    if (!manager) {
      return false;
    }

    return assertOwnedDocument(
      ctx,
      model,
      documentId,
      manager.documentId,
      message
    );
  };

  const guardBulkDocumentAccess = async (
    ctx: ControllerContext,
    model: string,
    user: AdminUser,
    documentIds: unknown,
    message: string
  ) => {
    const manager = await getManagerOrDeny(ctx, user);

    if (!manager) {
      return false;
    }

    return assertBulkDocumentsOwned(
      ctx,
      model,
      documentIds,
      manager.documentId,
      message
    );
  };

  const guardManagedMutation = async (
    ctx: ControllerContext,
    model: string,
    user: AdminUser,
    options?: { checkOneToOne?: boolean; currentDocumentId?: string }
  ) => (await enforceManagedMutation(ctx, model, user, options)) !== false;

  const collectionTypesController = plugin.controllers['collection-types'];

  const wrapManagedCollectionAction = (
    actionName: string,
    guard: (ctx: ControllerContext, model: string, user: AdminUser) => Promise<boolean>
  ) => {
    const original = collectionTypesController[actionName];

    if (!original) {
      return;
    }

    collectionTypesController[actionName] = async function (ctx) {
      const { model } = ctx.params;
      const user = ctx.state.user as AdminUser | undefined;

      if (shouldGuardManagedModel(model, user)) {
        try {
          const allowed = await guard(ctx, model, user as AdminUser);

          if (!allowed) {
            return;
          }
        } catch (error) {
          strapi.log.error(`Error validando ${actionName} en ${model}:`, error);
        }
      }

      return original.call(this, ctx);
    };
  };

  const originalFind = collectionTypesController.find;
  collectionTypesController.find = async function (ctx) {
    const { model } = ctx.params;
    const user = ctx.state.user as AdminUser | undefined;

    if (user && !isSuperAdmin(user)) {
      if (ALL_MANAGED_MODELS.includes(model)) {
        try {
          const manager = await getUserManager(user);

          applyFilterClause(
            ctx,
            manager
              ? { manager: { documentId: { $eq: manager.documentId } } }
              : { documentId: { $eq: 'no-match' } }
          );
        } catch (error) {
          strapi.log.error(`Error aplicando filtro en ${model}:`, error);
        }
      }

      if (model === MANAGER_MODEL) {
        try {
          const manager = await getUserManager(user);

          applyFilterClause(
            ctx,
            manager
              ? { documentId: { $eq: manager.documentId } }
              : { documentId: { $eq: 'no-match' } }
          );
        } catch (error) {
          strapi.log.error('Error filtrando manager para editor:', error);
        }
      }
    }

    return originalFind.call(this, ctx);
  };

  wrapManagedCollectionAction('create', async (ctx, model, user) =>
    guardManagedMutation(ctx, model, user, { checkOneToOne: true })
  );

  wrapManagedCollectionAction('publish', async (ctx, model, user) => {
    const documentId = ctx.params.id as string | undefined;

    if (
      documentId &&
      !(await guardSingleDocumentAccess(
        ctx,
        model,
        user,
        documentId,
        'No tienes permiso para publicar este registro'
      ))
    ) {
      return false;
    }

    return guardManagedMutation(ctx, model, user, {
      checkOneToOne: true,
      currentDocumentId: documentId
    });
  });

  wrapManagedCollectionAction('findOne', (ctx, model, user) =>
    guardSingleDocumentAccess(
      ctx,
      model,
      user,
      ctx.params.id as string | undefined,
      'No tienes permiso para ver este registro'
    )
  );

  wrapManagedCollectionAction('update', async (ctx, model, user) => {
    if (
      !(await guardSingleDocumentAccess(
        ctx,
        model,
        user,
        ctx.params.id as string | undefined,
        'No tienes permiso para actualizar este registro'
      ))
    ) {
      return false;
    }

    return guardManagedMutation(ctx, model, user);
  });

  wrapManagedCollectionAction('delete', (ctx, model, user) =>
    guardSingleDocumentAccess(
      ctx,
      model,
      user,
      ctx.params.id as string | undefined,
      'No tienes permiso para eliminar este registro'
    )
  );

  wrapManagedCollectionAction('clone', async (ctx, model, user) => {
    if (
      !(await guardSingleDocumentAccess(
        ctx,
        model,
        user,
        ctx.params.sourceId as string | undefined,
        'No tienes permiso para clonar este registro'
      ))
    ) {
      return false;
    }

    return guardManagedMutation(ctx, model, user, { checkOneToOne: true });
  });

  wrapManagedCollectionAction('discard', (ctx, model, user) =>
    guardSingleDocumentAccess(
      ctx,
      model,
      user,
      ctx.params.id as string | undefined,
      'No tienes permiso para descartar este registro'
    )
  );

  wrapManagedCollectionAction('unpublish', (ctx, model, user) =>
    guardSingleDocumentAccess(
      ctx,
      model,
      user,
      ctx.params.id as string | undefined,
      'No tienes permiso para despublicar este registro'
    )
  );

  wrapManagedCollectionAction('bulkDelete', (ctx, model, user) =>
    guardBulkDocumentAccess(
      ctx,
      model,
      user,
      ctx.request.body?.documentIds,
      'No tienes permiso para eliminar uno o más registros solicitados'
    )
  );

  wrapManagedCollectionAction('bulkPublish', async (ctx, model, user) => {
    if (
      !(await guardBulkDocumentAccess(
        ctx,
        model,
        user,
        ctx.request.body?.documentIds,
        'No tienes permiso para publicar uno o más registros solicitados'
      ))
    ) {
      return false;
    }

    return guardManagedMutation(ctx, model, user);
  });

  wrapManagedCollectionAction('bulkUnpublish', (ctx, model, user) =>
    guardBulkDocumentAccess(
      ctx,
      model,
      user,
      ctx.request.body?.documentIds,
      'No tienes permiso para despublicar uno o más registros solicitados'
    )
  );

  wrapManagedCollectionAction('countDraftRelations', (ctx, model, user) =>
    guardSingleDocumentAccess(
      ctx,
      model,
      user,
      ctx.params.id as string | undefined,
      'No tienes permiso para inspeccionar este registro'
    )
  );

  wrapManagedCollectionAction('countManyEntriesDraftRelations', (ctx, model, user) =>
    guardBulkDocumentAccess(
      ctx,
      model,
      user,
      ctx.request.query?.documentIds,
      'No tienes permiso para inspeccionar uno o más registros solicitados'
    )
  );

  const relationsController = plugin.controllers.relations;

  if (relationsController) {
    const wrapManagedRelationAction = (actionName: 'findAvailable' | 'findExisting') => {
      const original = relationsController[actionName];

      if (!original) {
        return;
      }

      relationsController[actionName] = async function (ctx) {
        const user = ctx.state.user as AdminUser | undefined;

        if (user && !isSuperAdmin(user)) {
          try {
            const sourceAccessResult = await enforceManagedSourceDocumentAccess(ctx, user);

            if (sourceAccessResult === false) {
              return;
            }

            await applyManagedRelationFilter(ctx, user);
          } catch (error) {
            strapi.log.error(`Error filtrando ${actionName} de relaciones:`, error);
          }
        }

        return original.call(this, ctx);
      };
    };

    wrapManagedRelationAction('findAvailable');
    wrapManagedRelationAction('findExisting');
  }

  return plugin;
};
