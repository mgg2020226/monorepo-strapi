import type { Struct } from "@strapi/strapi"

/**
 * Compatibility declaration for the project content-types.
 *
 * Strapi's type generator currently crashes with TypeScript 7 while the
 * runtime still loads these schemas correctly. Keeping the UIDs in the
 * registry prevents the generated factory/document APIs from rejecting the
 * project's content-types during development and build.
 */
type ProjectCollectionType = Struct.CollectionTypeSchema & {
  attributes: Record<string, any>
}

declare module "@strapi/strapi" {
  export namespace Public {
    export interface ContentTypeSchemas {
      "api::form-definition.form-definition": ProjectCollectionType
      "api::legal-page.legal-page": ProjectCollectionType
      "api::portfolio-project.portfolio-project": ProjectCollectionType
      "api::site.site": ProjectCollectionType
    }
  }
}
