import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getStudentAssignments } from "../../../../../api";
import StudentAssignment from "../../../../../components/student/assignment";
import ConnectActivity from "../../../../../components/student/connect";
import CreativityActivity from "../../../../../components/student/creativity";
import RespondActivity from "../../../../../components/student/respond";

export default function CreateRespondActivity () {

  const router = useRouter();
  const { slug, piece, actCategory } = router.query;
  const dispatch = useDispatch();
  // I think this should show the melody for the current piece, but in the student's transposition
  // need to get the student's current assignment
  const { isLoading: loaded, error: assignmentsError, data: assignments } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug
  })
  // console.log({ slug, piece, actCategory })
  const currentAssignment = assignments && assignments.filter((assn) => assn.part.piece.slug === piece && assn.activity.activity_type.category === actCategory)?.[0]
  console.log('currentassignment', currentAssignment)
  console.log('actCategory', actCategory) 
  
  // TODO: branch on actCategory
  return currentAssignment ? <StudentAssignment assignment={currentAssignment}>
    {actCategory === 'Create' ? <CreativityActivity/> : actCategory === 'Respond' ? <RespondActivity/> : <ConnectActivity />}
  </StudentAssignment> : <Spinner as="span"
    animation="border"
    size="sm"
    role="status"
    aria-hidden="true">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
}