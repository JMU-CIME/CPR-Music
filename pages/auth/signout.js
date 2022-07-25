import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { signOut, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/layout';
import { logoutUser } from '../../actions';

function SignOut() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const logout = (ev) => {
    console.log('loggingout', ev, session);
    dispatch(logoutUser(session.djangoToken));
    signOut({ callbackUrl: '/' });
  };
  return (
    <Layout>
      <Row>
        <Col md={4}>
          <h1>Are you sure you want to Sign Out?</h1>
          <Button variant="warning" onClick={logout}>
            Sign out
          </Button>
        </Col>
      </Row>
    </Layout>
  );
}

export default SignOut;
