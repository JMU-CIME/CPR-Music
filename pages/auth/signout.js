import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Layout from "../../components/layout";
import { signOut } from "next-auth/react";
const SignOut = () => {
  const logout = (ev) => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <Layout>
      <Row>
        <Col md={4}>
          <h1>Are you sure you?</h1>
          <Button variant="warning" onClick={logout}>
            Sign out
          </Button>
        </Col>
      </Row>
    </Layout>
  );
};

export default SignOut;
