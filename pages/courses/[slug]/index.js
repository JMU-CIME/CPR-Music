import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudentAssignments,
  fetchActivities,
  fetchPieces,
  selectEnrollment,
  fetchEnrollments,
} from '../../../actions';
import Layout from '../../../components/layout';
import StudentCourseView from '../../../components/student/course';
import TeacherCourseView from '../../../components/teacher/course';

export default function CourseDetails() {
  // get assignments/activities
  const userInfo = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const { items: assignments, loaded: loadedAssignments } = useSelector(
    (state) => state.assignments
  );
  const router = useRouter();
  const { slug } = router.query;

  const enrollments = useSelector((state) => state.enrollments);

  const assignedPieces = useSelector(
    (state) => state.assignedPieces.items[slug]
  );
  const pieces = useSelector((state) => state.pieces);

  const currentEnrollment = useSelector((state) => state.selectedEnrollment);
  useEffect(() => {
    if (userInfo.loaded) {
      dispatch(fetchEnrollments(userInfo.token));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (userInfo.token) {
      dispatch(fetchStudentAssignments({ token: userInfo.token, slug }));
      dispatch(fetchActivities({ token: userInfo.token, slug }));
      dispatch(fetchPieces(userInfo.token));
    }
    
  }, [slug, dispatch, userInfo]);

  useEffect(() => {
    console.log('enrollments to filter', enrollments);
    dispatch(
      selectEnrollment(
        enrollments.items.filter(
          (enrollment) => enrollment.course.slug === slug
        )[0]
      )
    );
  }, [enrollments]);

  console.log('assignments', assignments, loadedAssignments);
  console.log('current enrollment', currentEnrollment);
  return (
    <Layout>
      <h1>{currentEnrollment?.course?.name ?? 'Details'}</h1>
      {currentEnrollment.role === 'Student' ? (
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
      )}
    </Layout>
  );
}
