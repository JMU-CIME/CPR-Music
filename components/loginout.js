import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
// import { useSelector } from "react-redux";

function LoginOut() {
  const { data: session } = useSession();
  // const loginStatus = useSelector((state) => state.loginStatus);
  return session ? (
    <Link href="/api/auth/signout" passHref>
      <Nav.Link>Logout</Nav.Link>
    </Link>
  ) : (
    <Link href="/auth/signin" passHref>
      <Nav.Link>Login</Nav.Link>
    </Link>
  );
}

export default LoginOut;
