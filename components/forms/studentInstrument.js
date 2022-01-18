import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { updateEnrollmentInstrument } from "../../actions";

const StudentInstrument = ({ enrollment, token, options: instruments }) => {
  const [instrument, setInstrument] = useState(
    enrollment?.instrument?.id ?? ""
  );
  const dispatch = useDispatch();
  const updateInstrument = (ev) => {
    console.log("update instrument to ", instrumentsMap[ev.target.value].name);

    dispatch(
      updateEnrollmentInstrument({
        djangoToken: token,
        enrollmentId: enrollment.id,
        instrumentId: ev.target.value,
      })
    );
    setInstrument(ev.target.value);
  };

  const instrumentsMap = {};
  instruments.forEach((option) => (instrumentsMap[option.id] = option));

  return (
    <Form.Group as={Row} className="mb-3" controlId="formRosterCSV">
      <Form.Label column sm={2}>
        Instrument for {enrollment.user.name}
      </Form.Label>
      <Col sm={10}>
        <Form.Select value={instrument ?? ""} onChange={updateInstrument}>
          <option value="">None</option>
          {instruments &&
            instruments.map((instrumentOption) => (
              <option key={instrumentOption.id} value={instrumentOption.id}>
                {instrumentOption.name}
              </option>
            ))}
        </Form.Select>
      </Col>
    </Form.Group>
  );
};

export default StudentInstrument;
