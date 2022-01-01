import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rememberLogin } from "../actions";
import LoginOut from "./loginout";

const Navigation = () => {
  const dispatch = useDispatch()

  const loginStatus = useSelector(state => state.loginStatus);

  const [isTeacher, setIsTeacher] = useState(loginStatus.isTeacher);
  const [isStudent, setIsStudent] = useState(loginStatus.isStudent);
  const [isLoggedOut, setIsLoggedOut] = useState(loginStatus.isLoggedOut);

  const persistLogin = (ev) => {
    ev.preventDefault();
    console.log("persist logged in");
    dispatch(rememberLogin({
      isTeacher,
      isStudent,
      isLoggedOut
    }))
  };

  const changedStudentloggedin = (ev) => {
    console.log("changedStudentloggedin", ev);
    setIsTeacher(false);
    setIsLoggedOut(false);
    setIsStudent(true);
  };
  const changedTeacherloggedin = (ev) => {
    console.log("changedTeacherloggedin", ev);
    setIsStudent(false);
    setIsLoggedOut(false);
    setIsTeacher(true);
  };
  const changedLoggedout = (ev) => {
    console.log("changedLoggedout", ev);
    setIsTeacher(false);
    setIsStudent(false);
    setIsLoggedOut(true);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Music CPR</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref>
              <Nav.Link>Home</Nav.Link>
            </Link>
            {/* <Link href="/courses" passHref>
              <Nav.Link>Courses</Nav.Link>
            </Link> */}
            <NavDropdown title="Courses" id="basic-nav-dropdown">
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
            </NavDropdown>
            <NavDropdown title="Assignments" id="basic-nav-dropdown">
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
            </NavDropdown>
          </Nav>
          <Nav>
            <Form>
              <Form.Group as={Row}>
                <Col className="d-flex align-items-center">
                  <Form.Check
                    name="loggedin"
                    type="radio"
                    id="studentloggedin"
                    label="studentloggedin"
                    onChange={changedStudentloggedin}
                    checked={isStudent}
                  />
                </Col>
                <Col className="d-flex align-items-center">
                  <Form.Check
                    name="loggedin"
                    type="radio"
                    id="teacherloggedin"
                    label="teacherloggedin"
                    onChange={changedTeacherloggedin}
                    checked={isTeacher}
                  />
                </Col>
                <Col className="d-flex align-items-center">
                  <Form.Check
                    name="loggedin"
                    type="radio"
                    id="loggedout"
                    label="loggedout"
                    onChange={changedLoggedout}
                    checked={isLoggedOut}
                  />
                </Col>
                <Col className="d-flex align-items-center">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={persistLogin}
                  >
                    Remember
                  </Button>
                </Col>
              </Form.Group>
            </Form>
            <LoginOut/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
