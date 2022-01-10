import { useSelector } from "react-redux";
// import Layout from "../../components/layout";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt";

import Authorized from "../../components/authorized";
// import { fetchMyEnrollments } from "../../lib/enrollments";
// import { useDispatch } from "react-redux";
import { fetchCourses } from "../../actions";
import { initializeStore } from "../../store";

const secret = process.env.SECRET;

export async function getServerSideProps(context) {
  const store = initializeStore();
  const { req } = context;
  // const session = await getSession(context);
  const token = await getToken({ req, secret });
  console.log("serversidetoken", token);
  if (!token) {
    const redirectDestination = `/auth/signin?callbackUrl=${context.resolvedUrl}`;
    console.log({ redirectDestination });
    return {
      redirect: {
        destination: redirectDestination,
      },
    };
  }
  // console.log("session");
  // console.log(session);
  console.log(token);
  // console.log("\n\n\n\ntoken", token);
  store.dispatch(fetchCourses(token.djangoToken));
  return {
    props: {},
  };
  // const myCourses = await fetchMyEnrollments(token.djangoToken);
  // console.log("mycourses");
  // console.log(myCourses);
  // return {
  //   props: {
  //     myCourses,
  //   },
  // };
}

const Courses = ({ myCourses }) => {
  // const { data: session } = useSession();
  console.log({ myCourses });
  const courses = useSelector((state) => state.courses);
  // let courses = [];
  // if (session) {
  //   courses = storedCourses;
  // }
  return (
    <Authorized>
      <h1>Courses</h1>
      <p>Shows all courses this user is related to</p>
      <Link href="/courses/new">
        <Button>Add Course</Button>
      </Link>
      <p>{courses.length}</p>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>{course.name}</li>
        ))}
      </ul>
    </Authorized>
  );
};

export default Courses;
