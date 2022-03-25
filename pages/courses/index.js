import Layout from '../../components/layout';
import Enrollments from '../../components/enrollments';

function Courses() {
  
  return (
    <Layout>
      <h1>Your courses</h1>
      {/* <Link href="/courses/new">
        <Button>Add Course</Button>
      </Link> */}
      
      <Enrollments />
    </Layout>
  );
}

export default Courses;
