import { useSession } from 'next-auth/react';

import Layout from '../../components/layout';
import AddEditCourse from '../../components/forms/addEditCourse';


export default function CreateCourse() {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1>Create a course</h1>

      <AddEditCourse session={session} />
    </Layout>
  );
}
