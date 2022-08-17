import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { mutateGradeSubmission } from "../../../api";
import { postRecording } from "../../../actions";

export default function RTE({submission, submitAction, autoFocus=false}) {
  const router = useRouter();
  const userInfo = useSelector((state) => state.currentUser)
  const { slug } = router.query;
  // console.log('submission', submission, autoFocus)
  // console.log('passed in okd', onKeyDown)
  const [ isFormFocused, setFormFocus ] = useState(false);
  const [ rhythm, setRhythm ] = useState(0);
  const [ tone, setTone ] = useState(0);
  const [ expression, setExpression ] = useState(0);
  const audioRef = useRef();
  const gradeKeyDown = (ev) => {
    if (ev.key === " ") {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause()
      }
    }
  }
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
  const queryClient = useQueryClient()
  const gradeMutation = useMutation(mutateGradeSubmission(slug), {
    onMutate: async (newGrade) => {
      // console.log('newGrade', newGrade)
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('gradeableSubmissions')
      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueryData('gradeableSubmissions')
      // Optimistically update to the new value
      queryClient.setQueryData('gradeableSubmissions', old => {
        // console.log('old', old);
        if (old) {
          return [...old.map((sub) => sub.id === newGrade.sub ? {...sub, grades: [...sub.grades, newGrade]} : sub)]
        } 
        return [] 
      })
      // Return a context object with the snapshotted value
      return { previousSubmissions }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newGrade, context) => {
      queryClient.setQueryData('gradeableSubmissions', context.previousSubmissions)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('gradeableSubmissions')
    },
  });
  const grade = ({sub,
    r,
    t,
    e,
    grader}) => gradeMutation.mutate({student_submission:sub,
    rhythm: r,
    tone: t,
    expression: e,
    grader})
  

  return <Form onSubmit={(ev)=>{
    // console.log('onSubmit');
    ev.preventDefault();
    ev.stopPropagation();
    if (!submitAction) {
      grade({sub: submission.id, r:rhythm, t:tone, e:expression, grader:userInfo.id})
    } else {
      submitAction({ r: rhythm, t: tone, e: expression, grader: userInfo.id });
    }
  }}>
    <Form.Group className="mb-3" controlId="Rhythm">
      <FloatingLabel
        controlId="floatingInput"
        label="Rhythm"
        className="mb-3"
      >
        <Form.Control type="number" onChange={(ev) => {console.log('ev', ev); setRhythm(ev.target.value)}} placeholder="1" min={1} max={5} autoFocus={autoFocus} onFocus={() => setFormFocus(true)} onBlur={() => setFormFocus(false)} />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3" controlId="Tone">
      <FloatingLabel
        controlId="floatingInput"
        label="Tone"
        className="mb-3"
      >
        <Form.Control type="number" onChange={(ev) => {console.log('ev', ev); setTone(ev.target.value)}} placeholder="1" min={1} max={5} onFocus={() => setFormFocus(true)} onBlur={() => setFormFocus(false)} />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3" controlId="Expression">
      <FloatingLabel
        controlId="floatingInput"
        label="Expression"
        className="mb-3"
      >
        <Form.Control type="number" onChange={(ev) => {console.log('ev', ev); setExpression(ev.target.value)}} placeholder="1" min={1} max={5} onFocus={() => setFormFocus(true)} onBlur={() => setFormFocus(false)} />
      </FloatingLabel>
    </Form.Group>

    <Button variant="primary" type="submit" className="mb-3">Submit</Button>
  </Form>
}