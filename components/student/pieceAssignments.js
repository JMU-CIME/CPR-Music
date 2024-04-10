import { useRouter } from "next/router";
import { getStudentAssignments } from "../../api";
import { Card, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import Link from "next/link";
import SubmissionsStatusBadge from "../submissionStatusBadge";
import { assnToContent, assnToKey } from "./navActivityPicker";
import InstrumentSelector from "../instrumentSelector"

function PieceAssignments({piece, canEditInstruments}) {
  const router = useRouter();

  const { slug } = router.query;

  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery(['assignments',slug], getStudentAssignments(slug), {
    enabled: !!slug, staleTime: 5*60*1000
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
  if (!slug || assignmentsError || !assignments || !assignments[piece]) {
    if (assignmentsError) {
      console.error(assignmentsError)
    }
    return <p>You have no assignments for this piece at this time.</p>
  }
  return <Card className="student-piece-activity-group">
    <Card.Header className="fw-bold">
      {assignments[piece][0].piece_name}
      <InstrumentSelector defaultInstrument={assignments[piece][0].instrument}/>
    </Card.Header>
    <ListGroup>
      {assignments[piece]
        .map((assignment) => (
          <ListGroupItem
            key={`assn-${assignment.id}`}
            className="d-flex justify-content-between"
          >
            <Link
              passHref
              href={`/courses/${slug}/${assignment.piece_slug
                }/${assnToKey(assignment, 'debug str this is from pieceAssignments')}`}
            >
              <a>{assnToContent(assignment)}</a>
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
