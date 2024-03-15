import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import { PieceAssignments } from "../../../../components/student/pieceAssignments";

export default function PieceActivities() {
  const router = useRouter();
  const { piece} = router.query;
  
  return (
    <Layout>
      <PieceAssignments piece={piece}/>
    </Layout>
  );
}