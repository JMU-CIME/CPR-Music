import { SessionProvider } from 'next-auth/react';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-musiccpr.css';
import '../styles/global.css';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { wrapper } from '../store';

export function App({ Component, pageProps: { session, ...pageProps } }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default wrapper.withRedux(App);
