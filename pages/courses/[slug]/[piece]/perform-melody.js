import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import ListGroup from 'react-bootstrap/ListGroup';
// import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { useSelector, useDispatch } from 'react-redux';
import { selectAssignment } from '../../../../actions';

export default function PerformMelody() {
  const router = useRouter();
  const { slug, piece } = router.query;
  const dispatch = useDispatch();

  // is this the right approach or more probably I should just hit backend for exactly this assignment?
  // TODO: need piece slug here
  // const assignments = useSelector((state) => state.assignments);
  // useEffect(() => {
  //   dispatch(
  //     selectAssignment(
  //       assignments.filter((assn) => assn.part.piece.slug === piece)[0]
  //     )
  //   );
  // }, [slug, piece]);

  return (
    <Row>
      <Col>
        <h1>Perform Melody</h1>;
      </Col>
    </Row>
  );
}
