import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from "react-bootstrap/Container";
import Link from "next/link";

const Navigation = () => {
  return <Navbar bg="light" expand="lg">
    <Container>
      <Link href="/" passHref>
        <Navbar.Brand>Music CPR</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link href="#home" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>
          <Link href="#link" passHref>
            <Nav.Link>Link</Nav.Link>
          </Link>
        </Nav>
        <Nav>
          <Link href="login" passHref>
            <Nav.Link>Login</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
}

export default Navigation