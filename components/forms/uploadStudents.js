import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { didInstrument, uploadRoster } from '../../actions';

function UploadStudents() {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();
  const { slug } = router.query;
  const userInfo = useSelector((state) => state.currentUser);

  const { shouldInstrument = false } = useSelector(
    (state) => state.enrollments
  );

  if (shouldInstrument && router.asPath.endsWith('/edit')) {
    console.log('shouldInstrument', shouldInstrument);
    router.push(router.asPath.replace('/edit', '/instruments'));
    dispatch(didInstrument())
  }

  const uploadStudents = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    console.log('add student ev', ev);

    const formData = new FormData();

    // Update the formData object
    formData.append('file', file, file.name);

    // Details of the uploaded file
    console.log(file);

    // don't refresh the page
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(
      uploadRoster({
        body: formData,
        djangoToken: userInfo.token,
        courseSlug: slug,
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    console.log(`Loading status: ${loading}`);
  }, [loading]);

  return (
    <div className="my-5">
      <h2>Add Students</h2>
      <p>
        Create a <abbr title="Comma-Separated Value">CSV</abbr> file with format
        format <code>fullname,username,password,grade</code>
      </p>
      <p>
        We provide{' '}
        <a download href="/roster-for-musiccpr.csv">
          this example roster csv file
        </a>{' '}
        in case it's easiest to just edit that.
        {/* Plese use{' '}
        <a target="_blank" rel="noopener noreferrer"
          href="https://docs.google.com/spreadsheets/d/1Z2yauf5xqv6P2fBUM-l-0UeCRp5BPsHwt3_lkysibbw/edit?usp=sharing">
          this template
        </a>{' '}
        from Google Sheets to create a CSV file for your class. */}
      </p>
      <Form onSubmit={uploadStudents}>
        <Form.Group as={Row} className="mb-3" controlId="formRosterCSV">
          <Form.Label column sm={2}>
            Roster CSV
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="file"
              placeholder="Roster CSV"
              onChange={(ev) => {
                console.log('setFile', ev);
                setFile(ev.target.files[0]);
              }}
            />
          </Col>
        </Form.Group>
        <Button type="submit" disabled={loading} className={loading ? "btn btn-secondary" : "btn btn-primary"}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </Form>
    </div>
  );
}

export default UploadStudents;
