import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { attemptLogin } from "../actions";
import Layout from "../components/layout";


const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const setters = {
    email: setEmail,
    password: setPassword
  }

  const handleChange = (ev) => {
    console.log(ev, ev.target.type, ev.target.value)
    setters[ev.target.type](ev.target.value)
  }

  const login = (ev) => {
    ev.preventDefault();
    console.log(email, password)
    dispatch(attemptLogin({email, password}))
  }

  return (
    <Layout>
      <h1>Sign In</h1>
      <Form onSubmit={login}>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onChange={handleChange} type="email" value={email} placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={handleChange} type="password" value={password} placeholder="Password" />
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </Layout>
  );
};

export default Login;
