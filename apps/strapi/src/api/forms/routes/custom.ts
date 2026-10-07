export default {
  routes: [
    {
      method: "POST",
      path: "/forms/:siteSlug/:formSlug/submit",
      handler: "forms.submit",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
}
