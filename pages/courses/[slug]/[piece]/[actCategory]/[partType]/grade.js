import { useRouter } from "next/router";
import { useQuery } from 'react-query';
import { getRecentSubmissions } from '../../../../../../api';
import Layout from "../../../../../../components/layout";
import GradePerform from "../../../../../../components/teacher/grade/perform";
import { Spinner } from "react-bootstrap";

export default function GradeActivity() {
  const router = useRouter();
  const { slug, piece, partType } = router.query;

  // TODO: should't render this thing if not a teacher
  const { isLoading, error, data: submissions } = useQuery(['gradeableSubmissions', slug, piece, partType], getRecentSubmissions({ slug, piece, partType }), { enabled: !!slug && !!piece && !!partType })

  if (error) return `An error has occurred: ${error.message}`

  return <Layout>
    { !slug || !piece || !partType || isLoading || !submissions ? 
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        variant="primary"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner> :
      <GradePerform submissions={submissions} />
    }
  </Layout>
}