import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { mutateGradeSubmission } from '../../../api';
import {
  beginUpload,
  uploadFailed,
  uploadSucceeded,
} from '../../../actions';
import StatusIndicator from '../../statusIndicator';

export default function RTE({ submission, submitAction, autoFocus = false }) {
  const router = useRouter();
  const userInfo = useSelector((state) => state.currentUser);
  const { slug } = router.query;
  const [isFormFocused, setFormFocus] = useState(false);
  const [rhythm, setRhythm] = useState(submission?.grade?.rhythm ?? '');
  const [tone, setTone] = useState(submission?.grade?.tone ?? '');
  const [expression, setExpression] = useState(submission?.grade?.expression ?? '');
  const audioRef = useRef();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const gradeMutation = useMutation(mutateGradeSubmission(slug), {
    onMutate: async (newGrade) => {
      dispatch(beginUpload(`grade-${submission.id}`));
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('gradeableSubmissions');
      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueryData(
        'gradeableSubmissions'
      );
      // Optimistically update to the new value
      queryClient.setQueryData('gradeableSubmissions', (old) => {
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
      dispatch(uploadFailed(`grade-${submission.id}`));
      queryClient.setQueryData(
        'gradeableSubmissions',
        context.previousSubmissions
      );
    },
    onSuccess: () => {
      dispatch(uploadSucceeded(`grade-${submission.id}`));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('gradeableSubmissions');
    },
  });
  const grade = ({ sub, r, t, e, grader }) =>
    gradeMutation.mutate({
      student_submission: sub,
      rhythm: r,
      tone: t,
      expression: e,
      grader,
    });

  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!submitAction) {
          grade({
            sub: submission.id,
            r: rhythm,
            t: tone,
            e: expression,
            grader: userInfo.id,
          });
        } else {
          submitAction({
            r: rhythm,
            t: tone,
            e: expression,
            grader: userInfo.id,
          });
        }
      }}
    >
      <Form.Group className="mb-3" controlId="Rhythm">
        <FloatingLabel
          controlId="floatingInput"
          label="Rhythm"
          className="mb-3"
        >
          <Form.Control
            type="number"
            defaultValue={rhythm}
            onChange={(ev) => {
              setRhythm(ev.target.value);
            }}
            placeholder="1"
            min={1}
            max={5}
            autoFocus={autoFocus}
            onFocus={() => setFormFocus(true)}
            onBlur={() => setFormFocus(false)}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3" controlId="Tone">
        <FloatingLabel controlId="floatingInput" label="Tone" className="mb-3">
          <Form.Control
            type="number"
            defaultValue={tone}
            onChange={(ev) => {
              setTone(ev.target.value);
            }}
            placeholder="1"
            min={1}
            max={5}
            onFocus={() => setFormFocus(true)}
            onBlur={() => setFormFocus(false)}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3" controlId="Expression">
        <FloatingLabel
          controlId="floatingInput"
          label="Expression"
          className="mb-3"
        >
          <Form.Control
            type="number"
            defaultValue={expression}
            onChange={(ev) => {
              setExpression(ev.target.value);
            }}
            placeholder="1"
            min={1}
            max={5}
            onFocus={() => setFormFocus(true)}
            onBlur={() => setFormFocus(false)}
          />
        </FloatingLabel>
      </Form.Group>
      <Button variant="primary" type="submit" className="mb-3">
        Submit
      </Button>{' '}
      <StatusIndicator statusId={(!!submitAction ? submission?.id : `grade-${submission.id}`) ?? 'respond'} />
    </Form>
  );
}
