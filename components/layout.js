import styles from "./layout.module.css";
import Container from "react-bootstrap/Container";
import Navigation from "./nav";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/teleband_logo.png" />
        <meta
          name="description"
          content="Music CPR" />
      </Head>
      <Navigation />
      <Container>
        <main className={styles.container}>{children}</main>
      </Container>
    </>
  );
}
