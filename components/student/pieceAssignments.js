import { useRouter } from "next/router";
import { getStudentAssignments } from "../../api";
import { Card, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import Link from "next/link";
import SubmissionsStatusBadge from "../submissionStatusBadge";

function PieceAssignments({piece}) {
  const router = useRouter();

  const { slug } = router.query;

  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  if (isLoading) {
    return <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      variant="primary"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  }

  if (assignmentsError || !assignments || !assignments[piece]) {
    if (assignmentsError) {
      console.error(assignmentsError)
    }
    console.log('assignments', assignments)
    console.log('piece', piece)
    console.log('assignments[piece]', assignments[piece])

    return <p>You have no assignments for this piece at this time.</p>
  }


  return <Card className="student-piece-activity-group">
    <Card.Header className="fw-bold">{assignments[piece][0].piece_name}</Card.Header>
    <ListGroup>
      {assignments[piece]
        .map((assignment) => (
          <ListGroupItem
            key={`assn-${assignment.id}`}
            className="d-flex justify-content-between"
          >
            <Link
              passHref
              href={`${slug}/${assignment.piece_slug
                }/${assignment.activity_type_category}${assignment.activity_type_category === 'Perform'
                  ? `/${assignment.part_type}`
                  : ''
                }`}
            >
              <a>{assignment.activity_type_name.split(' ')[0]}</a>
            </Link>
            <SubmissionsStatusBadge assn={assignment} />
          </ListGroupItem>
        ))}
    </ListGroup>
  </Card>

}

export {
  PieceAssignments,
}