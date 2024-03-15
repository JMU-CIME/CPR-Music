import { useRouter } from 'next/router';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';
import { getStudentAssignments } from '../../../../../api';
import StudentAssignment from '../../../../../components/student/assignment';
import CreativityAuralActivity from '../../../../../components/student/create/aural';

export default function CreateAuralActivityPage() {
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const {
    isLoading: loaded,
    error: assignmentsError,
    data: assignments,
  } = useQuery(['assignments',slug], getStudentAssignments(slug), {
    enabled: !!slug, staleTime: 5*60*1000
  });
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter((assn) => {
        return (
          assn.piece_slug === piece &&
          assn.activity_type_category === actCategory
        );
      })?.[0];

  // TODO: branch on actCategory

  return currentAssignment ? (
    <StudentAssignment assignment={currentAssignment}>
      <CreativityAuralActivity/>
    </StudentAssignment>
  ) : (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      variant="primary"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
