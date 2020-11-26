const withSourceMaps = require('@zeit/next-source-maps')();
const path = require('path');
const withOffline = require('next-offline');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  API_URL,
  COOKIE_DOMAIN,
  COOKIE_SECURE,
  STRIPE_TOKEN,
  GA_TOKEN,
} = process.env;

module.exports = withBundleAnalyzer(withOffline({
  target: 'serverless',
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  generateInDevMode: false,
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  async rewrites() {
    return [
      { 
        source: '/',
        destination: 'https://www.utilityapparel.com/quidditch-uk/'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/referees',
        destination: '/volunteer/referees',
        permanent: true,
      },
      {
        source: '/snitches',
        destination: '/volunteer/snitches',
        permanent: true,
      },
      {
        source: '/clubs',
        destination: '/find-quidditch',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/find-quidditch',
        permanent: true,
      },
      {
        source: '/teamuk',
        destination: '/programmes/team-england',
        permanent: true,
      },
    ]
  },
  webpack: (config, options) => {
    // In `pages/_app.js`, Sentry is imported from @sentry/node. While
    // @sentry/browser will run in a Node.js environment, @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs#customizing-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/browser when
    // building the browser's bundle
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      NODE_ENV === 'production'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
          release: options.buildId,
        })
      )
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Here is the magic
    // We push our config into the resolve.modules array
    config.resolve.modules.push(path.resolve('./'))

    return config;
  },
  publicRuntimeConfig: {
    apiUrl: API_URL,
    cookiesDomain: COOKIE_DOMAIN,
    cookiesSecure: COOKIE_SECURE,
    stripeToken: STRIPE_TOKEN,
  },
  env: {
    gaToken: GA_TOKEN,
  }
}));
