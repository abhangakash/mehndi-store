export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin-login', '/api/', '/profile', '/checkout', '/cart'],
      },
    ],
    sitemap: 'https://mehndi.zevette.com/sitemap.xml',
    host: 'https://mehndi.zevette.com',
  }
}