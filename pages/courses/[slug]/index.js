import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { getEnrollments, getStudentAssignments } from '../../../api';
import Layout from '../../../components/layout';
import StudentCourseView from '../../../components/student/course';
import TeacherCourseView from '../../../components/teacher/course';


// this is the course details page. it should show different things to the
// student vs the teacher, notice the branch in the rendering

export default function CourseDetails() {
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments, {staleTime: 5 * 60 * 1000})
  const router = useRouter();
  const { slug } = router.query;
  const currentEnrollment = enrollments && enrollments.filter((elem) => elem.course.slug === slug)[0]
  return (
    <Layout>
      {
        currentEnrollment && 
        <>
          <h1>{currentEnrollment?.course?.name ?? 'Details'}</h1>
          {currentEnrollment.role === 'Student' ? (
            <StudentCourseView 
              canEditInstruments={currentEnrollment?.course?.can_edit_instruments}
            />
          ) : (
            <div>
              <Link href={`/courses/${slug}/edit`}>
                <Button variant="primary">Edit Course Details</Button>
              </Link>
              <div className="my-5">
                <TeacherCourseView/>
              </div>
            </div>
          )}
        </>
      }
    </Layout>
  );
}
