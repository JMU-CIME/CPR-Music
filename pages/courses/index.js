import { useSelector } from "react-redux";
import Layout from "../../components/layout";
import Button from "react-bootstrap/Button"
import Link from "next/link";

const Courses = () => {

  const courses = useSelector((state) => state.courses)

  return (
    <Layout>
      <h1>Courses</h1>
      <p>Shows all courses this user is related to</p>
      <Link href="/courses/new"><Button>Add Course</Button></Link>
      <ul>
        {courses.map((course) => <li key={course.id}>{course.name}</li>)}
      </ul>
    </Layout>
  )
}

export default Courses