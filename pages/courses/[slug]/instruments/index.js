import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstruments, fetchRoster } from '../../../../actions';
import StudentInstrument from '../../../../components/forms/studentInstrument';
import Layout from '../../../../components/layout';

const Instruments = () => {
  const { data: session } = useSession();
  const { items: instruments, loaded: instrumentsLoaded } = useSelector(
    (state) => state.instruments
  );
  // const { items: roster, loaded: rosterLoaded } = useSelector(
  //   (state) => state.roster
  // );
  const roster = useSelector((state) => state.roster);
  console.log('roster', roster);
  const router = useRouter();
  const { slug } = router.query;
  console.log('instruments', instruments);
  const dispatch = useDispatch();
  useEffect(() => {
    if (session && !instrumentsLoaded) {
      dispatch(fetchInstruments(session.djangoToken));
    }
    // if (session) {
    if (session && !roster.loaded) {
      dispatch(
        fetchRoster({ djangoToken: session.djangoToken, courseSlug: slug })
      );
    }
  }, [session, dispatch]);
  const updateInstruments = (ev) => {};
  return (
    <Layout>
      <h1>Instruments</h1>
      <p>
        Below are the default instrument assignments for the students in this
        class. You can Change their default below, or change their instrument
        only for a specific assignment on the UNIMPLEMENTED SCREEN // TODO
      </p>
      <Form onSubmit={updateInstruments}>
        {roster.items &&
          roster.items.map((enrollment) => (
            <StudentInstrument
              key={enrollment.id}
              enrollment={enrollment}
              options={instruments}
              token={session.djangoToken}
            />
            // <p key={enrollment.id}>{enrollment.user.name}</p>
          ))}
      </Form>
    </Layout>
  );
};

export default Instruments;
