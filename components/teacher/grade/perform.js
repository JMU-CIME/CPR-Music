import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { Card, Col, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import RTE from "./rte";

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

export default function GradePerform({submissions}) {
  // should show:
  //    piece name, piece score, audio object, grading scales
  const pressedKey = (idx) => (ev) => {
    if (ev.key === "Enter") {
      console.log(ev.key, ' is enter')
    } else {
      console.log(ev.key, " ain't enter") 
    }
  }
  return <Row>
    <Col>
      <h2>Grading Perform Activity for Air for Band</h2>
      <FlatEditor height={200} />
      { submissions && submissions.map((submission, submissionIdx) => {console.log(submissionIdx, submissionIdx===0); return <RTE key={submission.id} submission={submission} autoFocus={submissionIdx===0} onKeyDown={pressedKey(submissionIdx)} />})}
    </Col>
  </Row>
  // return 
}