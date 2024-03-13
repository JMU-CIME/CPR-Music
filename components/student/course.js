import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
// import TranspositionBadge from '../transpositionBadge';
import SubmissionStatusBadge from '../submissionStatusBadge';
import { getStudentAssignments } from '../../api';
import { PieceAssignments } from './pieceAssignments';
// on the student's course view:
// show the name of the course
// show the assignments that still need to be completed
// show the assignments that have already been completed

export default function StudentCourseView({ enrollment }) {
  const router = useRouter();
  const { slug } = router.query;
  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery(['assignments',slug], getStudentAssignments(slug), {
    enabled: !!slug, staleTime: 5*60*1000
  });

  // moved to api
  // const activitySort = (a, b) => {
  //   const ordering = {
  //     Melody: 1,
  //     Bassline: 2,
  //     Creativity: 3,
  //     Reflection: 4,
  //     Connect: 5,
  //   };
  //   // console.log(a, b)
  //   const c = a.activity_type_name.split(' ')[0];
  //   const d = b.activity_type_name.split(' ')[0];
  //   return ordering[c] - ordering[d];
  // };

  return (
    <Row>
      <Col>
        <h2>Assignments</h2>
        {/* <div className="student-assignments"> */}
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
              <PieceAssignments key={`${pieceSlug}-activities`} piece={pieceSlug} />
            ))
          ) : (
            <p>You have no assignments at this time.</p>
          )}
        </div>
      </Col>
    </Row>
  );
}
