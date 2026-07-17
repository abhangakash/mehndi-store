export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin-login',
          '/api/',
          '/profile',
          '/checkout',
          '/cart',
        ],
      },
    ],
    sitemap: 'https://www.crabveda.com/sitemap.xml',
  }
}