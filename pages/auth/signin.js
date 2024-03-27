import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Layout from '../../components/layout';
import { Alert } from 'react-bootstrap';
import { useState } from 'react';

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const { error } = useRouter().query;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

  }

  return (
    <Layout>
      <Form
        className="mt-3"
        onSubmit={handleSubmit}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Form.Group as={Row} className="mb-3" controlId="formUsername">
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Button type="submit">Sign in</Button>
        {error && <SignInError error={error} />}
      </Form>
    </Layout>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const token = await getCsrfToken(context);
  return {
    props: {
      csrfToken: token ?? null,
    },
  };
}

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin: 'Sign in failed. Check your login credentials.',
  default: 'Unable to sign in.',
};

function SignInError({ error = errors.default }) {
  const errorMessage = error && (errors[error] ?? errors.default);
  return (
    <Alert variant="danger">
      {errorMessage}{' '}
      {error === 'CredentialsSignin' && (
        <a href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/accounts/password/reset/`}>
          Forgot your password?
        </a>
      )}
    </Alert>
  );
}
