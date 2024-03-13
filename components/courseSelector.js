import { useQuery } from "react-query";
import { getEnrollments } from "../api";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { Nav } from "react-bootstrap";
import Link from "next/link";
import { useSelector } from "react-redux";


function CourseSelector() {
  const { loaded: userLoaded, groups } = useSelector(state => state.currentUser)
  const router = useRouter();
  const changeCourse = (ev) => {
    console.log('courseSelector::ev.target.value:', ev.target.value)
    router.push(`/courses/${ev.target.value}`)
  }
  const { slug } = router.query;
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments, {staleTime: 5 * 60 * 1000})

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

  // if they aren't logged in, or have no enrollments
  if (enrollments && (enrollments.length === 0 || JSON.stringify(enrollments) === '{}')) {
    return null;
  }

  // if the user has only one enrollment, don't show the dropdown
  if (enrollments && enrollments.length === 1 && (!groups || !groups.some(gName => gName === "Teacher"))) {
    return <Nav.Item><Link href={`/courses/${enrollments[0].course.slug}`} passHref>
      <Nav.Link>{enrollments[0].course.name}</Nav.Link>
    </Link></Nav.Item>
  }

  //probably don't need the spinner here?
  return <Nav.Item className="me-1">
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
        <Form><Form.Select onChange={changeCourse} defaultValue={selectedCourse?.slug} className="me-1">
          {enrollments && <option value="" disabled={!!slug}>Choose your course</option>}
          {enrollments && enrollments.map((enrollment) => (
            <option key={enrollment.course.slug} value={enrollment.course.slug}>{enrollment.course.name}</option>
          ))}
          {groups && groups.some(gName => gName === "Teacher") && <optgroup label="Teacher Actions">
            <option value="">All my courses</option>
            <option value="new">➕ Create a new course...</option>
          </optgroup>}
        </Form.Select></Form>
      ))}
  </Nav.Item>
}

export default CourseSelector;