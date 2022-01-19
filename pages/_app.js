import { SessionProvider } from 'next-auth/react';
import { wrapper } from '../store';
import '../styles/global.css';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

export function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default wrapper.withRedux(App);
