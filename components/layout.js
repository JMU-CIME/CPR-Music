import styles from "./layout.module.css";
import Container from "react-bootstrap/Container";
import Navigation from "./nav";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const PUBLIC_PATHS = ["/", "/about", "/auth/signin", "/api/auth/signout"];

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? "with" : "without"
        } shallow routing`
      );
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);
  const { status, data: session } = useSession({
    required: !PUBLIC_PATHS.includes(router.pathname),
  });
  return (
    <>
      <Head>
        <link rel="icon" href="/teleband_logo.png" />
        <meta name="description" content="Music CPR" />
      </Head>
      <Navigation />
      <Container>
        <main className={styles.container}>{children}</main>
      </Container>
    </>
  );
}
