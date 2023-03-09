import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../../../../components/layout";
import StudentCourseView from "../../../../components/student/course";
import { withRouter } from "react-router-dom";

export default function PieceActivities() {
  const router = useRouter();
  const path = router.pathname;
  const { slug, piece } = router.query;
  useEffect(() => {
    router.push(`/courses/${slug}/${piece}/Telephone`);
  }, []);

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