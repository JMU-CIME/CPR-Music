import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getRecentSubmissions } from '../../../../../../api';
import Layout from "../../../../../../components/layout";
import GradePerform from "../../../../../../components/teacher/grade/perform";

export default function GradeActivity() {
  const router = useRouter();
  const { slug, piece, actCategory, partType } = router.query;
  
  // TODO: should't render this thing if not a teachers
  const { isLoading, error, data: submissions } = useQuery('gradeableSubmissions', getRecentSubmissions({ slug, piece, actCategory, partType }))
  if (isLoading || !submissions) return 'Loading...'
  if (error) return `An error has occurred: ${  error.message}`
  
  return <Layout>
    <p>
      {`Grading: ${slug}/${piece}/${actCategory}/${partType}`}
    </p>
    <GradePerform/>
  </Layout>
}