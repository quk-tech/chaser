import { useEffect } from 'react';
import Router from 'next/router';
import * as Sentry from '@sentry/node';
import { QueryClientProvider, QueryClient } from 'react-query';

import { Chakra } from 'styles/chakra';
import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';

import { pageview } from 'modules/analytics';

const Layout = dynamic(() => import('containers/layout'));

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });
const queryClient = new QueryClient();

function App({ Component, pageProps, err }) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Chakra>
          <DocumentHead />
          <Layout {...pageProps}>
            <Component {...pageProps} err={err} />
          </Layout>
        </Chakra>
      </QueryClientProvider>
      <Scripts />
    </>
  );
}

export default App;
