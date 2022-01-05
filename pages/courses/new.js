import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { newCourse } from "../../actions";

const NewCourse = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const [name, setName] = useState("");

  const addCourse = (ev) => {
    console.log("ev", ev);
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(newCourse({ name }));
    router.push("/courses");
  };

  return (
    <Layout>
      <h1>Add Course</h1>
      <Form onSubmit={addCourse}>
        <Form.Group as={Row} className="mb-3" controlId="formCourseName">
          <Form.Label column sm={2}>
            Course Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Course name" value={name} onChange={(ev) => setName(ev.target.value)} />
          </Col>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
      {/* <p>Form with details...</p> */}
      {/* <p>Need to be able to upload roster here?</p> */}
    </Layout>
  );
};

export default NewCourse;
