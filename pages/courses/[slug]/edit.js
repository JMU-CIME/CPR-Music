import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { FaMusic } from 'react-icons/fa';
import { useQuery } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import AddEditCourse from '../../../components/forms/addEditCourse';
// import AddEditStudent from '../../../components/forms/addEditStudent';
import UploadStudents from '../../../components/forms/uploadStudents';
import Layout from '../../../components/layout';
import { getEnrollments, mutateCourse } from '../../../api';

export default function EditCourse() {
  const router = useRouter();
  const { slug } = router.query;

  const {
    isLoading,
    error,
    data: enrollments,
  } = useQuery('enrollments', getEnrollments);
  const currentEnrollment =
    enrollments && enrollments.filter((elem) => elem.course.slug === slug)[0];


  return isLoading ? (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  ) : (
    <Layout>
      <h1>Edit {currentEnrollment?.course?.name}</h1>

      <Link href={`/courses/${slug}/instruments`}>
        <Button variant="primary">
          Set Instrument Assignments <FaMusic />
        </Button>
      </Link>
      <AddEditCourse />
      {/* <AddEditStudent /> */}
      <UploadStudents />
    </Layout>
  );
}
