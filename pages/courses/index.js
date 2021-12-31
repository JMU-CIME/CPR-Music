import { useSelector } from "react-redux";
import Layout from "../../components/layout";

const Courses = () => {

  const courses = useSelector((state) => state.courses)

  return (
    <Layout>
      <h1>Courses</h1>
      <ul>
        {courses.map((course) => <li key={course.id}>{course.name}</li>)}
      </ul>
    </Layout>
  )
}

export default Courses