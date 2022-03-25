import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import {
  FaCalendar,
  FaFlagCheckered,
  FaLocationArrow,
  FaEdit,
  FaPlus,
} from 'react-icons/fa';
import { fetchEnrollments } from "../actions";

export default function Enrollments({ children }) {
  const dispatch = useDispatch();
  const { items: enrollments, loaded } = useSelector(
    (state) => state.enrollments
  );

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchEnrollments());
    } else {
      console.log('enrollments dont need to be fetched', enrollments)
    }
  }, [dispatch]);

  return (
    <div className="course-list">
      {enrollments &&
        enrollments.map((enrollment) => (
          <Card className="course-item" key={enrollment.course.url}>
            <Card.Body>
              <Card.Title>{enrollment.course.name}</Card.Title>
              <Card.Text>
                <FaCalendar />
                <span className="ml-3">{enrollment.course.start_date}</span>
                <br />
                <FaFlagCheckered />
                <span className="ml-3">{enrollment.course.end_date}</span>
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted d-flex justify-content-between">
              <Link href={`/courses/${enrollment.course.slug}`}>
                <Button variant="primary">
                  View <FaLocationArrow />
                </Button>
              </Link>
              <Link href={`/courses/${enrollment.course.slug}/edit`}>
                <Button variant="primary">
                  Edit <FaEdit />
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        ))}
    </div>
  );
}