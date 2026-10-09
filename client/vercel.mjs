// Set API_ORIGIN in Vercel to the HTTPS origin of the deployed API.
// The browser keeps using /api, so session and CSRF cookies remain same-origin.
const apiOrigin = process.env.API_ORIGIN?.replace(/\/$/, '');
if (!apiOrigin || !/^https:\/\/[^/]+$/.test(apiOrigin)) {
  throw new Error('Set API_ORIGIN to the HTTPS origin of the deployed API before deploying.');
}

export const config = {
  framework: 'vite',
  rewrites: [
    { source: '/api/:path*', destination: `${apiOrigin}/api/:path*` },
    { source: '/(.*)', destination: '/index.html' }
  ]
};
