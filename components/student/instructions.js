import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

export default function Instructions({body}) {
  console.log('Instructions::body:', body)
  return <Row>
    <Col>
      {/* <section id="instructions" dangerouslySetInnerHTML={{_html: body}} /> */}
      <section id="instructions">{body}</section>
    </Col>
  </Row>
}