import { useQuery } from "react-query";
import { getEnrollments } from "../api";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { Nav } from "react-bootstrap";
import Link from "next/link";


function CourseSelector() {
  const router = useRouter();
  const changeCourse = (ev) => {
    router.push(`/courses/${ev.target.value}`)
  }
  const { slug } = router.query;
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments)

  const currentEnrollment = slug &&
    enrollments ? enrollments.filter((elem) => elem.course.slug === slug)[0] : null;

  const selectedCourse = currentEnrollment?.course;

  // if the enrollments haven't loaded yet, show a spinner
  if (!enrollments && isLoading) {
    return <Nav.Item><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      variant="light"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner></Nav.Item>
  }
  
  // if the user has only one enrollment, don't show the dropdown
  if (enrollments && enrollments.length === 1) {
    return <Nav.Item><Link href={`/courses/${enrollments[0].course.slug}`} passHref>
      <Nav.Link>{ enrollments[0].course.name }</Nav.Link>
    </Link></Nav.Item>
  }

  //probably don't need the spinner here?
  return <Nav.Item>
    {!enrollments && isLoading ?
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
        aria-hidden="true"
        variant="light"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner> : (enrollments && (
        <Form inline><Form.Select onChange={changeCourse} defaultValue={selectedCourse?.slug} className="me-1">
        { enrollments && <option value="" disabled={!!slug}>Choose your course</option>}
        { enrollments && enrollments.map((enrollment) => (
          <option key={enrollment.course.slug} value={enrollment.course.slug}>{enrollment.course.name}</option> 
        ))}
      </Form.Select></Form>
    ))}
    </Nav.Item>
}

export default CourseSelector;