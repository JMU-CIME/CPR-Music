import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaCheck, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateEnrollmentInstrument } from '../../actions';
import * as types from '../../types';

function StudentInstrument({ enrollment, token, options: instruments }) {
  const [instrument, setInstrument] = useState(
    enrollment?.instrument?.id ?? ''
  );
  const dispatch = useDispatch();
  console.log('instruments in studentinstrument', instruments);

  const updateInstrument = (ev) => {
    // console.log('update instrument to ')
    console.log(typeof ev.target.value, typeof instruments[0].id);
    const instrumentObj = instruments.find((instr) => instr.id == ev.target.value);

    if (instrumentObj) {
      console.log('update instrument to ', instrumentObj.name);
    dispatch(
      updateEnrollmentInstrument({
        djangoToken: token,
        enrollmentId: enrollment.id,
        instrument: instrumentObj,
      })
    );
    setInstrument(ev.target.value);
    }
  };

  return (
    <Form.Group as={Row} className="mb-3" controlId="formRosterCSV">
      <Form.Label column sm={2}>
        Instrument for {enrollment.user.name}
      </Form.Label>
      <Col sm={6}>
        {instruments && instruments.length ? (
          <Form.Select value={instrument ?? ''} onChange={updateInstrument}>
            <option value="">None</option>
            {instruments &&
              instruments.map((instrumentOption) => (
                <option key={instrumentOption.id} value={instrumentOption.id}>
                  {instrumentOption.name}
                </option>
              ))}
          </Form.Select>
        ) : (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Col>
      <Col>
        {/* <FaSpinner
          className={
            enrollment.activityState === types.ActivityState.Active
              ? 'show-out fa-spin'
              : 'hiding'
          }
        />
        <FaTimesCircle
          className={
            enrollment.activityState === types.ActivityState.Erroneous
              ? 'show-out'
              : 'hiding'
          }
        />
        <FaCheck
          className={
            enrollment.activityState === types.ActivityState.Success
              ? 'show-out'
              : 'hiding'
          }
        /> */}
        {/* eslint-disable no-nested-ternary */}
        {enrollment.activityState === types.ActivityState.Active ? (
          <FaSpinner
            className={
              enrollment.activityState === types.ActivityState.Active
                ? 'show-out fa-spin'
                : 'hiding'
            }
          />
        ) : enrollment.activityState === types.ActivityState.Erroneous ? (
          <FaTimesCircle
            className={
              enrollment.activityState === types.ActivityState.Erroneous
                ? 'show-out'
                : 'hiding'
            }
          />
        ) : enrollment.activityState === types.ActivityState.Success ? (
          <FaCheck
            className={
              enrollment.activityState === types.ActivityState.Success
                ? 'show-out'
                : 'hiding'
            }
          />
        ) : null}
      </Col>
    </Form.Group>
  );
}

export default StudentInstrument;
