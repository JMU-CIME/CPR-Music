import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments, retrieveEnrollments } from "../../../actions";
import AddEditCourse from "../../../components/forms/addEditCourse";
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
      <AddEditCourse />
    </Layout>
  );
}

{
  /* <h1>Edit Course</h1>
      <h2>People</h2>
      <p>Need to be able to upload roster here...</p>
      <h2>Pieces</h2>
      <p>(Like for adding new pieces to the course)</p>
      <p>
        (probably should be 2 lists, those already assigned/added and those
        available to add)
      </p>
      <ul>
        {pieces && pieces.map((piece) => <li key={piece.id}>{piece.name}</li>)}
      </ul> */
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
