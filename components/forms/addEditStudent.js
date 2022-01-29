import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function AddEditStudent() {
  const [name, setName] = useState();
  const [grade, setGrade] = useState();

  const addStudent = (ev) => {
    console.log('add student ev', ev);

    // TODO: actually dispatch action to add a student here

    // don't refresh the page
    ev.preventDefault();
    ev.stopPropagation();
  };
  return (
    <div className="my-5">
      <h2>Add or Edit Student</h2>
      <Form onSubmit={addStudent}>
        <Form.Group as={Row} className="mb-3" controlId="formCourseName">
          <Form.Label column sm={2}>
            Student Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="James Madison"
              value={name}
              onChange={(ev) => {
                console.log('setName');
                setName(ev.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formGrade">
          <Form.Label column sm={2}>
            Grade
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="6"
              value={grade}
              onChange={(ev) => {
                console.log('setGrade');
                setGrade(ev.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Button type="submit">Add</Button>
      </Form>
    </div>
  );
}

export default AddEditStudent;
