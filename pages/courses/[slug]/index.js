import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAssignments } from "../../../actions";
import Layout from "../../../components/layout";

export default function CourseDetails() {
  // get assignments/activities
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { items: assignments, loaded: loadedAssignments } = useSelector(
    (state) => state.assignments
  );
  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    if (session && !loadedAssignments) {
      dispatch(fetchStudentAssignments({ token: session.djangoToken, slug }));
    }
  }, [session, dispatch]);

  return (
    <Layout>
      <h1>Course Details</h1>
    </Layout>
  );
}
