import { getCsrfToken } from 'next-auth/react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Layout from '../../components/layout';

export default function SignIn({ csrfToken }) {
  return (
    <Layout>
      <Form
        method="post"
        action="/api/auth/callback/credentials"
        className="mt-3"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Form.Group as={Row} className="mb-3" controlId="formUsername">
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" name="username" placeholder="Username" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPassword">
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
            />
          </Col>
        </Form.Group>
        <Button type="submit">Sign in</Button>
      </Form>
    </Layout>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/
