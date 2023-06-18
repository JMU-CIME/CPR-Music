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
  console.log('got into aural page', slug, piece, actCategory);
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
      .filter((assn) => {
        console.log('assn', assn);
        console.log(
          'assn.piece_slug === piece && assn.activity_type_category === actCategory',
          assn.piece_slug === piece &&
            assn.activity_type_category === actCategory
        );
        return (
          assn.piece_slug === piece &&
          assn.activity_type_category === actCategory
        );
      })?.[0];

  if (currentAssignment) {
    console.log('have current assn', currentAssignment);
  }

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
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
