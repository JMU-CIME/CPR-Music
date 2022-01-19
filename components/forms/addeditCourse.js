import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { newCourse } from '../../actions';

export default function AddEditCourse({ session }) {
  const router = useRouter();

  const dispatch = useDispatch();
  const selectedCourse = useSelector((state) => state.selectedCourse);

  const [name, setName] = useState(selectedCourse?.name ?? '');
  const [startDate, setStartDate] = useState(selectedCourse?.startDate);
  const [endDate, setEndDate] = useState(selectedCourse?.endDate);

  const addCourse = (ev) => {
    console.log('addCourse ev', ev);

    // don't refresh the page
    ev.preventDefault();
    ev.stopPropagation();

    if (session) {
      // tell redux we have changed data
      dispatch(
        newCourse({ name, startDate, endDate, token: session.djangoToken })
      );
    }

    // navigate back to the course list
    router.push('/courses');
  };
  return (
    <div className="my-5">
      <Form onSubmit={addCourse}>
        <Form.Group as={Row} className="mb-3" controlId="formCourseName">
          <Form.Label column sm={2}>
            Course Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Course name"
              value={name}
              onChange={(ev) => {
                console.log('setName');
                setName(ev.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formCourseStart">
          <Form.Label column sm={2}>
            Start Date
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(ev) => {
                console.log('setStartDate');
                setStartDate(ev.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formCourseEnd">
          <Form.Label column sm={2}>
            End Date
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(ev) => {
                console.log('setEndDate');
                setEndDate(ev.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
