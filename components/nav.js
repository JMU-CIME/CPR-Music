import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import LoginOut from './loginout';
import { getEnrollments } from '../api';
import CourseSelector from './courseSelector';

function Navigation() {
  const router = useRouter();
  const { slug } = router.query;
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments)
  const currentEnrollment = slug && enrollments && enrollments.filter((elem) => elem.course.slug === slug)[0]
  
  return (
    <Navbar bg="primary" variant="dark" expand="sm">
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand>Music CPR</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            { enrollments ? <CourseSelector /> : <Link href="/courses" passHref>
              <Nav.Link>Courses</Nav.Link>
            </Link> }
            {/* {currentEnrollment && (
              <Link href={`/courses/${slug}`} passHref>
                <Nav.Link>Assignments</Nav.Link>
              </Link>
            )} */}
            {/* <NavDropdown title="Courses" id="basic-nav-dropdown">
              <Link href="/courses" passHref>
                <NavDropdown.Item>All</NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <Link href="/courses/new" passHref>
                <NavDropdown.Item>Add</NavDropdown.Item>
              </Link>
              <Link href="/courses/edit" passHref>
                <NavDropdown.Item>Edit</NavDropdown.Item>
              </Link>
            </NavDropdown> */}
            {/* <NavDropdown title="Assignments" id="basic-nav-dropdown">
              <Link href="/courses/melody-assignment" passHref>
                <NavDropdown.Item>Melody</NavDropdown.Item>
              </Link>
              <Link href="/courses/bass-assignment" passHref>
                <NavDropdown.Item>Bass</NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <Link href="/courses/creativity-assignment" passHref>
                <NavDropdown.Item>Creativity</NavDropdown.Item>
              </Link>
              <Link href="/courses/reflection-assignment" passHref>
                <NavDropdown.Item>Reflection</NavDropdown.Item>
              </Link>
            </NavDropdown> */}
          </Nav>
          <Nav>
            <Link href="/about" passHref>
              <Nav.Link>About</Nav.Link>
            </Link>
            <LoginOut />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
