import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Layout from "../../../../components/layout";
import StudentCourseView from "../../../../components/student/course";
import { PieceAssignments } from "../../../../components/student/pieceAssignments";

export default function PieceActivities() {
  const router = useRouter();
  const { slug , piece} = router.query;
  
  return (
    <Layout>
      <PieceAssignments piece={piece}/>
    </Layout>
  );
}