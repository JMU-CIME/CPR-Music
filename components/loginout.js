import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";

const LoginOut = () => {
  const loginStatus = useSelector((state) => state.loginStatus);
  return loginStatus.isLoggedOut ? (
    <Link href="/login" passHref>
      <Nav.Link>Login</Nav.Link>
    </Link>
  ) : (
    <Link href="/logout" passHref>
      <Nav.Link>Logout</Nav.Link>
    </Link>
  );
};

export default LoginOut;
