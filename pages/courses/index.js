import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { fetchEnrollments } from "../../actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/layout";

const Courses = ({ myCourses }) => {
  const { data: session } = useSession({
    required: true,
  });
  const dispatch = useDispatch();
  const enrollments = useSelector((state) => state.enrollments.items);
  useEffect(() => {
    if (session) {
      dispatch(fetchEnrollments(session.djangoToken));
    }
  }, [session, dispatch]);
  return (
    <Layout>
      <h1>Courses</h1>
      <p>Shows all courses this user is related to</p>
      <Link href="/courses/new">
        <Button>Add Course</Button>
      </Link>
      <ul>
        {enrollments &&
          enrollments.map((enrollment) => (
            <li key={enrollment.course.url}>
              <Link href={`/courses/${enrollment.course.slug}`}>
                <a>{enrollment.course.name}</a>
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  );
};

export default Courses;
