import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Card, Col, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import RTE from './rte';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { mutateGradeSubmission } from '../../../api';

const FlatEditor = dynamic(() => import('../../flatEditor'), {
  ssr: false,
});

export default function GradePerform({ submissions }) {
  const router = useRouter();
  const { slug } = router.query;
  // console.log('submission', submission, autoFocus)
  // console.log('passed in okd', onKeyDown)
  const [isFormFocused, setFormFocus] = useState(false);
  const [rhythm, setRhythm] = useState(0);
  const [tone, setTone] = useState(0);
  const [expression, setExpression] = useState(0);
  const audioRef = useRef();
  const gradeKeyDown = (ev) => {
    if (ev.key === ' ') {
      if (audioRef?.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef?.current?.pause();
      }
    }
  };
  // console.log('document.activeElement', document.activeElement)
  //  onMutate: async newTodo => {
  //      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  //      await queryClient.cancelQueries('todos')
  //      // Snapshot the previous value
  //      const previousTodos = queryClient.getQueryData('todos')
  //      // Optimistically update to the new value
  //      queryClient.setQueryData('todos', old => [...old, newTodo])
  //      // Return a context object with the snapshotted value
  //      return { previousTodos }
  //    },
  const queryClient = useQueryClient();
  const gradeMutation = useMutation(mutateGradeSubmission(slug), {
    onMutate: async (newGrade) => {
      // console.log('newGrade', newGrade)
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('gradeableSubmissions');
      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueryData(
        'gradeableSubmissions'
      );
      // Optimistically update to the new value
      queryClient.setQueryData('gradeableSubmissions', (old) => {
        // console.log('old', old);
        if (old) {
          return [
            ...old.map((sub) =>
              sub.id === newGrade.sub
                ? { ...sub, grades: [...sub.grades, newGrade] }
                : sub
            ),
          ];
        }
        return [];
      });
      // Return a context object with the snapshotted value
      return { previousSubmissions };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newGrade, context) => {
      queryClient.setQueryData(
        'gradeableSubmissions',
        context.previousSubmissions
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('gradeableSubmissions');
    },
  });

  // should show:
  //    piece name, piece score, audio object, grading scales
  const pressedKey = (idx) => (ev) => {
    if (ev.key === 'Enter') {
      // console.log(ev.key, ' is enter')
    } else {
      // console.log(ev.key, " ain't enter")
    }
  };

  return (
    <Row>
      <Col>
        {submissions ? (
          <h2>
            Grading: {submissions?.[0].assignment?.part?.piece?.name} -{' '}
            {submissions?.[0].assignment.activity.activity_type.category}{' '}
            Activity
          </h2>
        ) : (
          <h2>No Submissions to Grade</h2>
        )}
        {/* TODO: should I show the flat score viewer during grading of perform? */}
        {/* <FlatEditor height={200} /> */}
        {submissions &&
          submissions.map((submission, submissionIdx) => {
            let reflection;
            let rte;
            console.log('submission');
            if (
              submission?.assignment?.activity?.activity_type?.category ===
                'Respond' &&
              submission?.content
            ) {
              const content = JSON.parse(submission.content);
              reflection = content.reflection;
              rte = { r: content.r, t: content.t, e: content.e };
            }
            return (
              <Row
                className={[
                  {
                    border: isFormFocused,
                  },
                  'border-primary',
                  'border-3',
                ]}
                key={submission.id}
              >
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {submission.assignment.enrollment.user.name}
                      </Card.Title>
                      <Card.Text>
                        {submission.attachments?.[0]?.file ? (
                          // eslint-disable-next-line jsx-a11y/media-has-caption
                          <audio
                            controls
                            src={submission.attachments[0].file}
                            ref={audioRef}
                          />
                        ) : submission?.assignment?.activity?.activity_type
                            ?.category === 'Respond' && submission?.content ? (
                          <Row>
                            <Col>
                              <p>
                                {JSON.parse(submission?.content).reflection}
                              </p>
                            </Col>
                            <Col xs={1}>
                              <dl>
                                <dt>R</dt>
                                <dd>
                                  <code>{rte.r}</code>
                                </dd>
                                <dt>T</dt>
                                <dd>
                                  <code>{rte.t}</code>
                                </dd>
                                <dt>E</dt>
                                <dd>
                                  <code>{rte.e}</code>
                                </dd>
                              </dl>
                            </Col>
                          </Row>
                        ) : (
                          submission?.assignment?.activity?.activity_type?.category.includes(
                            'Connect'
                          ) && <p>{submission?.content}</p>
                        )}
                      </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      {/* TODO: what time should I show here? */}
                      {submission.attachments?.[0]?.submitted && (
                        <ListGroupItem>
                          <time dateTime={submission.attachments[0].submitted}>
                            {submission.attachments[0].submitted}
                          </time>
                        </ListGroupItem>
                      )}
                      <ListGroupItem>{submission.id}</ListGroupItem>
                      {submission?.assignment?.activity?.activity_type
                        ?.category === 'Create' &&
                        submission?.content && (
                          <ListGroupItem>
                            <FlatEditor
                              scoreJSON={JSON.parse(submission.content)}
                            />
                          </ListGroupItem>
                        )}
                      <ListGroupItem>
                        {submission.attachments.length} submission
                        {submission.attachments.length === 1 ? '' : 's'}
                      </ListGroupItem>
                    </ListGroup>
                  </Card>
                </Col>
                <Col onKeyDown={gradeKeyDown}>
                  <RTE submission={submission} />
                </Col>
              </Row>
            );
          })}
      </Col>
    </Row>
  );
}
