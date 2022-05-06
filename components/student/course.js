import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Link from 'next/link';
import TranspositionBadge from '../transpositionBadge';
// on the student's course view:
// show the name of the course
// show the assignments that still need to be completed
// show the assignments that have already been completed

export default function StudentCourseView({ assignments, enrollment }) {
  console.log('student assignments', assignments);
  // const submittedAssignments = assignments.filter((assn) => {})
  // const outstandingAssignments = []



  return (
    <Row>
      <Col>
        <h2>Student Course View</h2>
        <ListGroup>
          {assignments &&
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
                    {assn.part.piece.name} {assn.activity.activity_type.name} <TranspositionBadge instrument={assn.instrument} />
                  </a>
                </Link>
              </ListGroupItem>
            ))}
        </ListGroup>
      </Col>
    </Row>
  );
}
