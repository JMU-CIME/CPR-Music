import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import StudentAssignment from "../../../../../components/student/assignment";
import CreativityActivity from "../../../../../components/student/creativity";
import RespondActivity from "../../../../../components/student/respond";

export default function CreateRespondActivity () {

  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const { items: assignments, loaded: loadedAssignments } = useSelector(
    (state) => state.assignments
  ); // TODO: use react-query here instead, otherwise I have to put that 
  // useEffect garbage here to grab the assignments if i don't know them yet
  

  const router = useRouter();
  const { slug, piece, actCategory } = router.query;
  // console.log({ slug, piece, actCategory })
  const currentAssignment = assignments.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  console.log('currentassignment', currentAssignment)
  console.log('actCategory', actCategory) 
  
  // TODO: branch on actCategory
  return currentAssignment ? <StudentAssignment assignment={currentAssignment}>
    {actCategory === 'Create' ? <CreativityActivity/> : <RespondActivity/>}
  </StudentAssignment> : <Spinner as="span"
    animation="border"
    size="sm"
    role="status"
    aria-hidden="true">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
}