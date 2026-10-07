/**
 * Strapi's type generator bundles its own Prettier version. Keep this
 * package-local config free of workspace plugins so generation remains
 * compatible with that bundled version.
 */
export default {
  singleQuote: false,
  semi: false,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "es5",
}
