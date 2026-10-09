const apiOrigin = process.env.API_ORIGIN?.replace(/\/$/, '');

if (!apiOrigin) {
  throw new Error('Set API_ORIGIN in Vercel environment variables.');
}

export const config = {
  framework: 'vite',
  rewrites: [
    {
      source: '/api/:path*',
      destination: `${apiOrigin}/api/:path*`
    },
    {
      source: '/(.*)',
      destination: '/index.html'
    }
  ]
};
