import { useSelector } from "react-redux";
// import Layout from "../../components/layout";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Authorized from "../../components/authorized";

const Courses = () => {
  const { data: session } = useSession();
  const storedCourses = useSelector((state) => state.courses);
  let courses = [];
  if (session) {
    courses = storedCourses;
  }
  return (
    <Authorized>
      <h1>Courses</h1>
      <p>Shows all courses this user is related to</p>
      <Link href="/courses/new">
        <Button>Add Course</Button>
      </Link>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>{course.name}</li>
        ))}
      </ul>
    </Authorized>
  );
};

export default Courses;
