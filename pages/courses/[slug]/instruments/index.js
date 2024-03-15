import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { fetchInstruments, fetchRoster } from '../../../../actions';
import StudentInstrument from '../../../../components/forms/studentInstrument';
import Layout from '../../../../components/layout';

function Instruments() {
  const userInfo = useSelector((state) => state.currentUser);
  const { items: instruments, loaded: instrumentsLoaded } = useSelector(
    (state) => state.instruments
  );
  const sortedIntruments = instrumentsLoaded ? Object.values(instruments).sort((A, B) => A.name > B.name): [];
  const roster = useSelector((state) => state.roster);
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  useEffect(() => {
    if ('token' in userInfo) {
      if (!instrumentsLoaded) {
        dispatch(fetchInstruments(userInfo.token));
      }
      if ((!roster.loaded && slug) || (roster.loaded && slug && slug !== roster.courseSlug)) {
        dispatch(
          fetchRoster({ djangoToken: userInfo.token, courseSlug: slug })
        );
      }
    }
  }, [dispatch, slug, userInfo]);
  return (
    <Layout>
      <h1>Instruments</h1>
      <p>
        Below are the default instrument assignments for the students in this
        class. You can change their defaults below, or change their instrument
        only for a specific assignment on an assignment's edit page.
      </p>
      <p>Changes made below will be automatically saved.</p>
      <Form>
        {roster?.items && Object.values(roster.items).length ? (
          Object.values(roster.items)
            .filter((e) => e.role !== 'Teacher')
            .map((enrollment) => (
              <StudentInstrument
                key={enrollment.id}
                enrollment={enrollment}
                options={sortedIntruments}
                token={userInfo.token}
              />
            ))
        ) : (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            variant="primary"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Form>
      <Link href={`/courses/${slug}/edit`}>
        <Button variant="primary">Return to Course Edit</Button>
      </Link>
    </Layout>
  );
}

export default Instruments;
