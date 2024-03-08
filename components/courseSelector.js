import { useQuery } from "react-query";
import { getEnrollments } from "../api";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";


function CourseSelector() {
  let navToCourse;
  const router = useRouter();
  const changeCourse = (ev) => {
    console.log('changeCourse', ev)
    console.log('navToCourse', navToCourse)
    router.push(`/courses/${ev.target.value}`)
  }
  const { slug } = router.query;
  const { isLoading, error, data: enrollments } = useQuery('enrollments', getEnrollments)

  const currentEnrollment = slug &&
    enrollments ? enrollments.filter((elem) => elem.course.slug === slug)[0] : null;

  const selectedCourse = currentEnrollment?.course;
  console.log('slug', slug);
  console.log('currentEnrollment', currentEnrollment);
  console.log('selectedCourse', selectedCourse);
  console.log('selectedCourse?.slug', selectedCourse?.slug);
  console.log('!!enrollments && isLoading', !!enrollments && isLoading)
  console.log('enrollments && selectedCourse', enrollments && selectedCourse)
  console.log('enrollments', enrollments)
  
  return !enrollments && isLoading ?
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner> : (enrollments && (
      <Form.Select onChange={changeCourse} defaultValue={selectedCourse?.slug} value={navToCourse}>
        { enrollments && <option>Choose your course</option>}
        { enrollments && enrollments.map((enrollment) => (
          <option key={enrollment.course.slug} value={enrollment.course.slug}>{enrollment.course.name}</option> 
        ))}
      </Form.Select>
    ))
}

export default CourseSelector;