import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Layout from "../../../../components/layout";
import StudentCourseView from "../../../../components/student/course";

export default function PieceActivities() {
  const router = useRouter();
  const { slug , piece} = router.query;
  
  return (
    <Layout>
      <p>{slug} - {piece}</p>
      
      {/* {currentEnrollment.role === 'Student' ? (
      <StudentCourseView
        assignments={assignments}
        enrollment={currentEnrollment}
      />
    ) : (
      <TeacherCourseView
        pieces={pieces}
        assignedPieces={assignedPieces}
        assignments={assignments}
      />
    )} */}
    </Layout>
  );
}