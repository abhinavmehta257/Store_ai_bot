import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // Skip layout for auth pages and pages with custom layouts
  const isAuthPage = Component.authPage;
  const hasCustomLayout = Component.getLayout;

  if (isAuthPage || hasCustomLayout) {
    return (
      <SessionProvider session={session}>
        {hasCustomLayout ? Component.getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
