import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import {
  FaCalendar,
  FaExternalLinkAlt,
  FaFlagCheckered,
  FaLink,
} from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import { fetchEnrollments } from '../../actions';
import Layout from '../../components/layout';

function Courses({ myCourses }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { items: enrollments, loaded } = useSelector(
    (state) => state.enrollments
  );
  useEffect(() => {
    if (session && !loaded) {
      dispatch(fetchEnrollments(session.djangoToken));
    }
  }, [session, dispatch]);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  return (
    <Layout>
      <h1>Your courses</h1>
      {/* <Link href="/courses/new">
        <Button>Add Course</Button>
      </Link> */}
      <div className="course-list">
        {enrollments &&
          enrollments.map((enrollment) => (
            <Card className="course-item" key={enrollment.course.url}>
              <Card.Body>
                <Card.Title>{enrollment.course.name}</Card.Title>
                <Card.Text>
                  With supporting text below as a natural lead-in to additional
                  content.
                </Card.Text>
                <Link href={`/courses/${enrollment.course.slug}/edit`}>
                  <Button variant="primary">
                    Go <FaExternalLinkAlt />
                  </Button>
                </Link>
              </Card.Body>
              <Card.Footer className="text-muted d-flex justify-content-between">
                <div>
                  <FaCalendar />
                  <span className="ml-3">{enrollment.course.start_date}</span>
                </div>
                <div>
                  <FaFlagCheckered />
                  <span className="ml-3">{enrollment.course.end_date}</span>
                </div>
              </Card.Footer>
            </Card>
          ))}
        <Card className="course-item">
          <Card.Body>
            <Card.Title>
              <Form.Control
                type="text"
                placeholder="Course name"
                value={name}
                onChange={(ev) => {
                  console.log('setName');
                  setName(ev.target.value);
                }}
              />
            </Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="primary">
              Go <FaExternalLinkAlt />
            </Button>
          </Card.Body>
          <Card.Footer className="text-muted d-flex justify-content-between">
            <div>
              <FaCalendar />
              <Form.Control
                type="date"
                className="date-field"
                placeholder="Start Date"
                value={startDate}
                onChange={(ev) => {
                  setStartDate(ev.target.value);
                }}
              />
            </div>
            <div>
              <FaFlagCheckered />
              <Form.Control
                type="date"
                className="date-field"
                placeholder="End Date"
                value={endDate}
                onChange={(ev) => {
                  setEndDate(ev.target.value);
                }}
              />
            </div>
          </Card.Footer>
        </Card>
      </div>
    </Layout>
  );
}

export default Courses;
