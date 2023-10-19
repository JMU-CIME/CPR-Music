import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaCalendarDay } from 'react-icons/fa';
import FlatEditor from '../flatEditor';

export default function RecentSubmission(assn) {
  // console.log('recent sub::', submitted, content, attachments);
  const {
    assn: { activity_type_category = null, submissions, activity = null },
  } = assn;
  // console.log('RecentSubmission::assn:', assn);
  // console.log('RecentSubmission::submissions:', submissions);
  if (!submissions || submissions.length === 0) return '';
  const mostRecent = submissions?.reduce((recent, current) =>
    new Date(recent.submitted) > new Date(current.submitted) ? recent : current
  );
  const { submitted, content, attachments } = mostRecent;
  const ctgy = activity_type_category ?? activity.activity_type.category;
  // console.log('activity ctgy', ctgy);
  // eg assn.submissions:
  // [
  //   {
  //     id: 3,
  //     submitted: '2023-10-18T14:37:58.708689-04:00',
  //     content:
  //       '{"score-partwise":{...}',
  //     grade: null,
  //     self_grade: null,
  //     attachments: [
  //       {
  //         id: 3,
  //         file: 'http://localhost:8000/media/student-recoding_qsgQlnR.mp3',
  //         submitted: '2023-10-18T14:37:59.016536-04:00',
  //       },
  //     ],
  //   },
  // ];

  return (
    <Card>
      {/* <Card.Img variant="top" as='div'>idk</Card.Img> */}
      <Card.Body>
        <Card.Title>Your Most Recent Submission</Card.Title>
        <Card.Text>
          If you would like to replace this submission, simply submit this
          assignment again.
        </Card.Text>
      </Card.Body>
      {attachments?.length > 0 && (
        <Card.Body>
          <audio controls src={attachments[0].file}>
            <a href={attachments[0].file}>
              download the recording (your browser doesn't support applying it
              here directly)
            </a>
          </audio>
        </Card.Body>
      )}
      {content && content !== 'N/A for Perform submissions' && (
        <Card.Body>
          {ctgy === 'Create' ? (
            <FlatEditor scoreJSON={content} />
          ) : ctgy === 'Respond' ? (
            <Row>
              <Col md={9}>
                <textarea rows={5} readOnly className="respond-preview">
                  {JSON.parse(content).reflection}
                </textarea>
              </Col>
              <Col>
                <dl className='row'>
                  <dt className='col-md-9'>Rhythm</dt>
                  <dd className='col-md-3'>{JSON.parse(content).r}</dd>
                  <dt className='col-md-9'>Tone</dt>
                  <dd className='col-md-3'>{JSON.parse(content).t}</dd>
                  <dt className='col-md-9'>Expression</dt>
                  <dd className='col-md-3'>{JSON.parse(content).e}</dd>
                </dl>
              </Col>
            </Row>
          ) : (
            ''
          )}
        </Card.Body>
      )}
      <Card.Body>
        {/* <Row>
            <Col> */}
        <time dateTime={submitted}>
          <FaCalendarDay />{' '}
          {new Date(submitted).toLocaleString(undefined, {
            weekday: 'short',
            day: 'numeric',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            month: 'short',
          })}
        </time>
        {/* </Col>
            <Col>else</Col>
          </Row> */}
      </Card.Body>
    </Card>
  );
}
