import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import TranspositionBadge from '../transpositionBadge';
import { getStudentAssignments } from '../../api';
// on the student's course view:
// show the name of the course
// show the assignments that still need to be completed
// show the assignments that have already been completed

export default function StudentCourseView({ enrollment }) {
  const router = useRouter();
  const { slug } = router.query;
  console.log('slug from router', slug);
  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  return (
    <Row>
      <Col>
        <h2>Student Course View</h2>
        { isLoading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <ListGroup>
            {assignments &&
              Array.isArray(assignments) && assignments.length > 0 ? 
              assignments.map((assn) => (
                <ListGroupItem key={assn.id}>
                  <Link
                    passHref
                    href={`${enrollment.course.slug}/${assn.part.piece.slug}/${
                      assn.activity.activity_type.category
                    }${
                      assn.activity.activity_type.category === 'Perform'
                        ? `/${assn.activity.part_type}`
                        : ''
                    }`}
                  >
                    <a>
                      {assn.part.piece.name} {assn.activity.activity_type.name}{' '}
                      <TranspositionBadge instrument={assn.instrument} />
                    </a>
                  </Link>
                </ListGroupItem>
              )) : <p>You have no assignments at this time.</p>
            }
          </ListGroup>
        )}
      </Col>
    </Row>
  );
}
