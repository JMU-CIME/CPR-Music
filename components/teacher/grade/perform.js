import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { Card, Col, Row } from "react-bootstrap";
import dynamic from "next/dynamic";

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

export default function GradePerform() {
  // should show:
  //    piece name, piece score, audio object, grading scales
  return <Row>
    <Col>
      <h2>Grading Perform Activity for Air for Band</h2>
      <FlatEditor height={200} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Michael Stewart</Card.Title>
              <Card.Text>
                Audio Object
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Submitted at this time</ListGroupItem>
              <ListGroupItem>nth submission</ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="Rhythm">
              <FloatingLabel
                controlId="floatingInput"
                label="Rhythm"
                className="mb-3"
              >
                <Form.Control type="number" placeholder="1" min={1} max={5} autoFocus />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="Tone">
              <FloatingLabel
                controlId="floatingInput"
                label="Tone"
                className="mb-3"
              >
                <Form.Control type="number" placeholder="1" min={1} max={5} />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="Expression">
              <FloatingLabel
                controlId="floatingInput"
                label="Expression"
                className="mb-3"
              >
                <Form.Control type="number" placeholder="1" min={1} max={5} />
              </FloatingLabel>
            </Form.Group>

            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Col>
        
      </Row>
      
    </Col>
  </Row>
  // return 
}