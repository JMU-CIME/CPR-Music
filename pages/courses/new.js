import AddEditCourse from '../../components/forms/addEditCourse';
import Layout from '../../components/layout';

export default function NewCourse() {
  return (
    <Layout>
      <h1>Add Course</h1>
      <AddEditCourse />
      {/* <p>Form with details...</p> */}
      {/* <p>Need to be able to upload roster here?</p> */}
    </Layout>
  );
}
