import { fetchInstruments } from "../actions";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from 'react-redux';

export default function InstrumentSelector({defaultInstrument}) {
  let { items: instruments, loaded: instrumentsLoaded } = useSelector(
    (state) => state.instruments
  );

  if (!instrumentsLoaded) {
    const dispatch = useDispatch();
    instruments = dispatch(fetchInstruments());
  }
  
  return (
    <Form.Select size="sm">
      {defaultInstrument && <option>{defaultInstrument}</option>}
      {instruments && (
        Object.values(instruments).map((instrument, index) => (
          <option key={index}>{instrument.name}</option>
        ))
      )} 
    </Form.Select>
  )
}
