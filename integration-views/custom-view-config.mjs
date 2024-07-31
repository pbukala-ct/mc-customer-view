/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Integration Views',
  description: 'Rendering additional data, some static, some dynamic.',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: 'tech-sales-good-store',
      hostUriPath: '/tech-sales-good-store/orders/5838b628-38d2-47c1-8576-a1faefa1c21f/general'
      // hostUriPath:
      //   '/tech-sales-good-store/customers/f52e4230-a1f9-4f49-b6eb-af33fba3ddad/general',
    },
    production: {
      customViewId: '${env:CUSTOM_VIEW_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  headers: {
    csp: {
      'connect-src': ['https://www.google.com/'],
      'frame-src': ['https://www.google.com/'],
    },
  },
  oAuthScopes: {
    view: [
      'view_orders',
      'view_customers',
      'view_shopping_lists',
      'view_products',
    ],
    manage: ['manage_orders', 'manage_shopping_lists'],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'LARGE',
  },
  locators: [
    'customers.customer_details.general',
    'orders.order_details.general',
  ],
  labelAllLocales: [{ locale: 'en', value: 'Integration Views' }],
  additionalEnv: {
    googleMapKey: '${env:GOOGLE_MAP_KEY}',
    googleMapOrigin: 'Adams-Lehmann-Straße+44,+80797+München',
  },
};

export default config;
