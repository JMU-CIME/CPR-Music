import Container from 'react-bootstrap/Container';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './nav';
import styles from './layout.module.css';
import { getUserProfile, gotUser } from '../actions';

const PUBLIC_PATHS = ['/', '/about', '/auth/signin', '/api/auth/signout'];

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`
      );
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  const { status, data } = useSession({
    required: !PUBLIC_PATHS.includes(router.pathname),
  });
  const dispatch = useDispatch()
  useEffect(() => {
    console.log('status', status, data)
    if (status === "authenticated") {
      dispatch(gotUser({user:data.user, token: data.djangoToken}))
      dispatch(getUserProfile({token: data.djangoToken}))
    }
  },[status, dispatch]);

  const {loaded: userLoaded, token } = useSelector(state => state.currentUser)
  console.log('layout token', token)
  return (
    <>
      <Head>
        <link rel="icon" href="/teleband_logo.png" />
        <meta name="description" content="Music CPR" />
      </Head>
      <Navigation />
      {
        userLoaded && token ?
          <Container>
            <main className={styles.container}>{children}</main>
          </Container> : <p>spinner</p>
      }
    </>
  );
}
