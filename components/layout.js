import styles from "./layout.module.css";
import Container from "react-bootstrap/Container";
import Navigation from "./nav";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <Container>
        <main className={styles.container}>{children}</main>
      </Container>
    </>
  );
}
