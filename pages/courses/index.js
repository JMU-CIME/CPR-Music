import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

import { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import {
  FaCalendar,
  FaFlagCheckered,
  FaLocationArrow,
  FaEdit,
  FaPlus,
} from 'react-icons/fa';
import { fetchEnrollments } from '../../actions';
import Layout from '../../components/layout';

function Courses({ myCourses }) {
  const dispatch = useDispatch();
  const { items: enrollments, loaded } = useSelector(
    (state) => state.enrollments
  );

  const userInfo = useSelector(state => state.currentUser)
  useEffect(() => {
    if (userInfo.loaded && !loaded) {
      dispatch(fetchEnrollments(userInfo.token));
    }
  }, [userInfo, dispatch]);

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
                  <FaCalendar />
                  <span className="ml-3">{enrollment.course.start_date}</span>
                  <br/>
                  <FaFlagCheckered />
                  <span className="ml-3">{enrollment.course.end_date}</span>

                </Card.Text>
                
              </Card.Body>
              <Card.Footer className="text-muted d-flex justify-content-between">
                <Link href={`/courses/${enrollment.course.slug}`}>
                  <Button variant="primary">
                    View <FaLocationArrow/>
                  </Button>
                </Link>
                <Link href={`/courses/${enrollment.course.slug}/edit`}>
                  <Button variant="primary">
                    Edit <FaEdit/>
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          ))}
        <Card className="course-item">
          <Card.Body>
            <Card.Text>
              <FaPlus/>
            </Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted d-flex justify-content-between">
            <Link href="/courses/create/">
              <Button variant="primary">
                  Create <FaPlus/>
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </Layout>
  );
}

export default Courses;
