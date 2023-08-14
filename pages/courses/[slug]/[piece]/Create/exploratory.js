import { useRouter } from 'next/router';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';
import { getStudentAssignments } from '../../../../../api';
import StudentAssignment from '../../../../../components/student/assignment';
import ExploratoryCreativityActivity from '../../../../../components/student/create/explore';

export default function CreateExploratoryActivityPage() {
  const router = useRouter();
  const { slug, piece } = router.query;
  const actCategory = 'Create';
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const {
    isLoading: loaded,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });
  const currentAssignment =
    assignments &&
    Object.values(assignments)
      .reduce((prev, current) => [...prev, ...current], [])
      .filter(
        (assn) =>
          assn.part.piece.slug === piece &&
          assn.activity.activity_type.category === actCategory
      )?.[0];

  // TODO: branch on actCategory

  /* eslint-disable no-nested-ternary */
  return currentAssignment ? (
    <StudentAssignment assignment={currentAssignment}>
      <ExploratoryCreativityActivity />
    </StudentAssignment>
  ) : (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
