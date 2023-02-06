import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { fetchInstruments, fetchRoster } from '../../actions';

function StudentsWithInstruments() {
  const userInfo = useSelector((state) => state.currentUser);
  const { items: instruments, loaded: instrumentsLoaded } = useSelector(
    (state) => state.instruments
  );
  const sortedIntruments = instrumentsLoaded ? Object.values(instruments).sort((A, B) => A.name > B.name) : [];
  const roster = useSelector((state) => state.roster);
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  useEffect(() => {
    if ('token' in userInfo) {
      if (!instrumentsLoaded) {
        dispatch(fetchInstruments(userInfo.token));
      }
      if (!roster.loaded && slug) {
        dispatch(
          fetchRoster({ djangoToken: userInfo.token, courseSlug: slug })
        );
      }
    }
  }, [dispatch, slug, userInfo]);

  return (
    <div>
      <h2>Current Students</h2>
      <div className='container'>
        {roster?.items && Object.values(roster.items).length && instruments ? (
          Object.values(roster.items)
            .filter((e) => e.role !== 'Teacher')
            .map((enrollment, index) => (
              <div className='row'>
                <div className='col-1'>{index + 1}. </div>
                <div className='col-3'>{enrollment.user.name}</div>
                <div className='col'>{
                  enrollment.instrument &&
                  instruments[enrollment.instrument.id] ?
                  instruments[enrollment.instrument.id].name :
                  "No Instrument Assigned"
                }</div>
              </div>
            ))
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
      </div>
    </div>
  );
}

export default StudentsWithInstruments;
