import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudentAssignments,
  // fetchActivities,
  fetchPieces,
  selectEnrollment,
  fetchEnrollments,
} from '../../../actions';
import { getEnrollments, getStudentAssignments } from '../../../api';
import Layout from '../../../components/layout';
import StudentCourseView from '../../../components/student/course';
import TeacherCourseView from '../../../components/teacher/course';


// this is the course details page. it should show different things to the
// student vs the teacher, notice the branch in the rendering

export default function CourseDetails() {
  // get assignments/activities
  // const userInfo = useSelector((state) => state.currentUser);
  // const dispatch = useDispatch();
  // const { items: assignments, loaded: loadedAssignments } = useSelector(
  //   (state) => state.assignments
  // );
  const router = useRouter();
  const { slug } = router.query;
  console.log('slug from router', slug);
  const { isLoading: loaded, error: assignmentsError, data: assignments } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug
  })
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments)
  const currentEnrollment = enrollments && enrollments.filter((elem) => elem.course.slug === slug)[0]
  // console.log('currentEnrollment', currentEnrollment)

  // const enrollments = useSelector((state) => state.enrollments);

  // const assignedPieces = useSelector(
  //   (state) => state.assignedPieces.items[slug]
  // );
  // // const pieces = useSelector((state) => state.pieces);

  // const currentEnrollment = useSelector((state) => state.selectedEnrollment);
  // useEffect(() => {
  //   if (userInfo.loaded) {
  //     dispatch(fetchEnrollments(userInfo.token));
  //   }
  // }, [userInfo, dispatch]);

  // useEffect(() => {
  //   dispatch(fetchStudentAssignments({ slug }));
  // }, [slug, dispatch]);

  // useEffect(() => {
  //   console.log('enrollments to filter', enrollments);
  //   dispatch(
  //     selectEnrollment(
  //       enrollments.items.filter(
  //         (enrollment) => enrollment.course.slug === slug
  //       )[0]
  //     )
  //   );
  // }, [enrollments]);

  // console.log('assignments', assignments, loadedAssignments);
  // console.log('current enrollment', currentEnrollment);
  return (
    <Layout>
      {
        currentEnrollment && 
        <>
          <h1>{currentEnrollment?.course?.name ?? 'Details'}</h1>
          {currentEnrollment.role === 'Student' ? (
            <StudentCourseView
              assignments={assignments}
              enrollment={currentEnrollment}
            />
          ) : (
            <TeacherCourseView
              // pieces={pieces}
              // assignedPieces={assignedPieces}
              // assignments={assignments}
            />
          )}
        </>
      }
    </Layout>
  );
}
