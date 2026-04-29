/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tamoorfans.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  // excludedPaths: ['/admin/*'],
  // additionalPaths: async (config) => {
  //   // Add all product paths dynamically later
  //   return [];
  // },
};
