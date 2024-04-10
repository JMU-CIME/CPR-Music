import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import { getStudentAssignments } from '../../api';
import { PieceAssignments } from './pieceAssignments';
// on the student's course view:
// show the name of the course
// show the assignments that still need to be completed
// show the assignments that have already been completed

export default function StudentCourseView({canEditInstruments=False}) {
  const router = useRouter();
  const { slug } = router.query;
  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery(['assignments',slug], getStudentAssignments(slug), {
    enabled: !!slug, staleTime: 5*60*1000
  });
  
  return (
    <Row>
      <Col>
        <h2>Assignments</h2>
        <div className="d-flex align-items-start flex-wrap gap-3">
          {/* eslint-disable no-nested-ternary */}
          {isLoading ? (
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
          ) : assignments && Object.keys(assignments).length > 0 ? (
            Object.keys(assignments).map((pieceSlug) => (
              <PieceAssignments 
                key={`${pieceSlug}-activities`} 
                piece={pieceSlug} 
                canEditInstruments={canEditInstruments}
              />
            ))
          ) : (
            <p>You have no assignments at this time.</p>
          )}
        </div>
      </Col>
    </Row>
  );
}
