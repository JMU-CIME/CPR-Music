import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstruments, fetchRoster } from '../../../../actions';
import StudentInstrument from '../../../../components/forms/studentInstrument';
import Layout from '../../../../components/layout';

function Instruments() {
  const userInfo = useSelector((state)=>state.currentUser)
  const { items: instruments, loaded: instrumentsLoaded } = useSelector(
    (state) => state.instruments
  );
  const roster = useSelector((state) => state.roster);
  console.log('roster', roster);
  const router = useRouter();
  const { slug } = router.query;
  console.log('instruments', instruments);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!instrumentsLoaded) {
      dispatch(fetchInstruments(userInfo.token));
    }
    // if (session) {
    if (!roster.loaded) {
      dispatch(
        fetchRoster({ djangoToken: userInfo.token, courseSlug: slug })
      );
    }
  }, [dispatch]);
  const updateInstruments = (ev) => {};
  return (
    <Layout>
      <h1>Instruments</h1>
      <p>
        Below are the default instrument assignments for the students in this
        class. You can change their defaults below, or change their instrument
        only for a specific assignment on an assignment's edit page. 
      </p>
      <p>
        Changes made below will be automatically saved.
      </p>
      <Form onSubmit={updateInstruments}>
        {roster.items &&
          roster.items.filter((e) => (e.role !== "Teacher")).map((enrollment) => (
            <StudentInstrument
              key={enrollment.id}
              enrollment={enrollment}
              options={instruments}
              token={userInfo.token}
            />
            // <p key={enrollment.id}>{enrollment.user.name}</p>
          ))}
      </Form>
      <Link href={`/courses/${slug}/edit`}>
        <Button variant="primary">
          Return to Course Edit
        </Button>
      </Link>
    </Layout>
  );
}

export default Instruments;
