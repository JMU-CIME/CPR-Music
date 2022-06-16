import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { newCourse } from '../../actions';

export default function AddEditCourse() {
  const router = useRouter();
  const { slug } = router.query;

  const dispatch = useDispatch();

  const enrollments = useSelector((state) => state.enrollments);
  const userInfo = useSelector((state) => state.currentUser);

  const selectedEnrollment = enrollments.items.filter((enrollment) => enrollment.course.slug === slug)[0];
  const selectedCourse = selectedEnrollment?.course;
  
  const today = new Date();
  const sampleEnd = new Date();
  sampleEnd.setMonth(sampleEnd.getMonth() + 3);
  sampleEnd.setDate(0);

  const [name, setName] = useState(selectedCourse ? selectedCourse.name : '');
  const [startDate, setStartDate] = useState(selectedCourse ? selectedCourse.start_date : today.toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(selectedCourse ? selectedCourse.end_date : sampleEnd.toISOString().substring(0, 10));
  const verb = selectedCourse ? "Edit" : "Create";

  const addCourse = (ev) => {
    console.log('addCourse ev', ev);

    // don't refresh the page
    ev.preventDefault();
    ev.stopPropagation();

    dispatch(
      newCourse({
        name,
        startDate,
        endDate,
        token: userInfo.token,
        userId: userInfo.id,
      })
    ).then((newSlug) => {
        router.push(`/courses/${newSlug}/edit`);

  });
}
  return (
    <div className="my-5">
      <h2>{verb} Course</h2>
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
