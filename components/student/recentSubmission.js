import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { FaCalendarDay } from 'react-icons/fa';
import dynamic from 'next/dynamic'
const FlatEditor = dynamic(() => import('../flatEditor'), {
  ssr: false,
});

export default function RecentSubmission(assn) {
  const {
    assn: { activity_type_category = null, submissions, activity = null },
  } = assn;
  if (!submissions || submissions.length === 0) return '';
  const mostRecent = submissions?.reduce((recent, current) =>
    new Date(recent.submitted) > new Date(current.submitted) ? recent : current
  );
  const { submitted, content, attachments } = mostRecent;
  const ctgy = activity_type_category ?? activity.activity_type.category;

  return (
    <Card>
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
      </Card.Body>
    </Card>
  );
}
