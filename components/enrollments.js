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
import { useQuery } from "react-query";
import { format } from 'date-fns'
import { getEnrollments } from "../api";
// import { fetchEnrollments } from "../actions";

export default function Enrollments({ children }) {
  const {loaded: userLoaded, groups } = useSelector(state => state.currentUser)
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments)
  if (isLoading) return 'Loading...'
  if (error) return `An error has occurred: ${  error.message}`

  // const dispatch = useDispatch();
  // const { items: enrollments, loaded } = useSelector(
  //   (state) => state.enrollments
  // );

  // useEffect(() => {
  //   if (!loaded) {
  //     dispatch(fetchEnrollments());
  //   } else {
  //     console.log('enrollments dont need to be fetched', enrollments)
  //   }
  // }, [dispatch]);

  console.log('enrollmentsenrollments', enrollments)
  return (
    <div className="course-list">
      {enrollments &&
        enrollments.map((enrollment) => (
          <Link href={`/courses/${enrollment.course.slug}`} key={enrollment.course.url}>
            <a className="course-item">
              <Card className={new Date(enrollment.course.end_date) < new Date() ? 'opacity-50' : ''}>
                <Card.Img variant="top" as="div" className="card-color" />
                <Card.Body>
                  <Card.Title>{enrollment.course.name}</Card.Title>
                  <Card.Text>
                    {/* <FaCalendar /> */}
                    <span className="ml-3">{format(new Date(enrollment.course.start_date), 'MMM d')}</span>&nbsp;-&nbsp; 
                    {/* <br /> */}
                    {/* <FaFlagCheckered /> */}
                    <span className="ml-3">{format(new Date(enrollment.course.end_date), 'MMM d')}</span>
                  </Card.Text>
                </Card.Body>
                {/* <Card.Footer className="text-muted d-flex justify-content-between">
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
                </Card.Footer> */}
              </Card>
            </a>
          </Link>
        ))}
      { groups && groups.some(gName=>gName==="Teacher") && <Link href="/courses/new">
        <a className="course-item">
          <Card>
            <Card.Img variant="top" as="div" className="card-color" />
            <Card.Body>
              <Card.Title>Add New Course</Card.Title>
              {/* <Card.Text>
                
              </Card.Text> */}
            </Card.Body>
            {/* <Card.Footer className="text-muted d-flex justify-content-between">
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
            </Card.Footer> */}
          </Card>
        </a>
      </Link> }
    </div>
  );
}