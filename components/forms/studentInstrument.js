import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch } from 'react-redux';
import { updateEnrollmentInstrument } from '../../actions';

function StudentInstrument({ enrollment, token, options: instruments }) {
  const [instrument, setInstrument] = useState(
    enrollment?.instrument?.id ?? ''
  );
  const dispatch = useDispatch();
  console.log('instruments in studentinstrument', instruments)

  const updateInstrument = (ev) => {
    console.log('update instrument to ', instruments[ev.target.value].name);

    dispatch(
      updateEnrollmentInstrument({
        djangoToken: token,
        enrollmentId: enrollment.id,
        instrument: instruments[ev.target.value],
      })
    );
    setInstrument(ev.target.value);
  };

  

  return (
    <Form.Group as={Row} className="mb-3" controlId="formRosterCSV">
      <Form.Label column sm={2}>
        Instrument for {enrollment.user.name}
      </Form.Label>
      <Col sm={10}>
        <Form.Select value={instrument ?? ''} onChange={updateInstrument}>
          <option value="">None</option>
          {instruments &&
            Object.values(instruments).map((instrumentOption) => (
              <option key={instrumentOption.id} value={instrumentOption.id}>
                {instrumentOption.name}
              </option>
            ))}
        </Form.Select>
      </Col>
    </Form.Group>
  );
}

export default StudentInstrument;
