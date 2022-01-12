import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments, retrieveEnrollments } from "../../../actions";
import Layout from "../../../components/layout";
import { wrapper } from "../../../store";

export default function EditCourse() {
  const enrollments = useSelector((state) => state.enrollments);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const djangoToken = session?.djangoToken;
  const { slug } = router.query;
  useEffect(() => {
    if (!enrollments.loaded) {
      console.log("djangoToken", djangoToken);
      dispatch(fetchEnrollments(djangoToken));
    }
  }, [slug, djangoToken]);

  const selectedEnrollment = enrollments.items.filter((enrollment) => {
    console.log("enrollment in filter", enrollment, slug);
    console.log(enrollment.course.slug === slug);
    return enrollment.course.slug === slug;
  })[0];
  return (
    <Layout>
      <h1>Edit {selectedEnrollment?.course?.name}</h1>
    </Layout>
  );
}

// export async function getStaticProps({ params }) {
//   console.log("params", params);
//   const { slug } = params;
//   return {
//     props: {
//       slug,
//     },
//   };
// }

// export const getStaticPaths = async (props) => {
//   console.log("getStaticPaths");
//   console.log("props", props);
//   const session = await getSession();
//   console.log("session");
//   console.log(session);
//   // const enrollments = await retrieveEnrollments()
//   return {
//     paths: [],
//     fallback: true,
//   };
// };
