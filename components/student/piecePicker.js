import { useRouter } from "next/router";
import { Form, Nav, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { getStudentAssignments } from "../../api";

function PiecePicker() {
  function onPieceChange(ev) {
    console.log('onpiecechange', ev.target.value)
    router.push(`/courses/${slug}/${ev.target.value}`)
  }
  const router = useRouter();
  const { slug, piece } = router.query;
  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery(['assignments',slug], getStudentAssignments(slug), {
    enabled: !!slug, staleTime: 5*60*1000
  });

  const pieces = assignments && assignments ? Object.keys(assignments).map(pieceSlug => {
    return {
      pieceSlug,
      pieceName: assignments[pieceSlug][0].piece_name,
    }
  }) : null;

  if (!pieces && isLoading) {
    return <Nav.Item><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      variant="light"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner></Nav.Item>
  }

  if (!pieces) {
    return null;
  }

  if (pieces.length === 1) {
    return null
  }

  return <Nav.Item className="me-1">
    <Form>
      <Form.Select onChange={onPieceChange} defaultValue={piece}>
        <option value="">Choose music</option>
        {pieces.map(piece => <option key={piece.pieceSlug} value={piece.pieceSlug}>{piece.pieceName}</option>)}
      </Form.Select>
    </Form>
  </Nav.Item>
}

export {
  PiecePicker,
};