// Keep font loading local to the browser. `next/font/google` performs a
// network request during the build, which makes builds depend on Google Fonts
// being reachable. The design system already provides the Roboto font stack
// with a system fallback in CSS.
export const fontRoboto = { variable: "" }
