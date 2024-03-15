import { useRouter } from "next/router";
import { Form, ListGroup, Nav, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { getStudentAssignments } from "../../api";

// FIXME: probably should not need this function at all, this info should probably have come from the backend?
function assnToKey(assignment, debugStr='') {
  if (assignment.activity_type_category.startsWith('Perform')) {
    // for Perform or PerformPost activities, need also Melody or Bassline
    return `${assignment.activity_type_category}/${assignment.activity_type_name}`;
  } else if (assignment.activity_type_category === 'Create') {
    // for Create activities, need to know which experience?
    if (assignment.activity_type_name === 'Aural' || assignment.activity_type_name === 'Creativity') {
      return 'Create';
    } else {
      return `${assignment.activity_type_category}/${assignment.activity_type_name.toLowerCase()}`;
    }
  } else if (assignment.activity_type_category.startsWith('Connect')) {
    return 'Connect';
  } else {
    return assignment.activity_type_category;
  }
}

// FIXME: probably should not need this function at all, this info should probably have come from the backend?
function assnToContent(assignment) {
  let assnTypeCat = assignment.activity_type_category;
  if (assnTypeCat.startsWith('Perform') || assnTypeCat.startsWith('Connect')) {
    assnTypeCat = assnTypeCat.substring(0, 'Perform'.length);
  }

  const contentByType = {
    'Perform': `${assignment.activity_type_name}`,
    'Create': `Create - ${assignment.activity_type_name}`,
    'Respond': `${assignment.activity_type_name}`,
    'Connect': `${assnTypeCat}`,
  }

  return contentByType[assnTypeCat];

}

function NavActivityPicker(assignment) {
  const router = useRouter();

  const { slug, piece, actCategory = 'Create' } = router.query;

  let currentActivity = actCategory;
  let currentRouteSuffix = router.asPath.substring(`/courses/${slug}/${piece}/`.length);

  const changeActivity = (ev) => {
    router.push(`/courses/${slug}/${piece}/${ev.target.value}`)
  }

  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery(['assignments',slug], getStudentAssignments(slug), {
    enabled: !!slug, staleTime: 5 * 60 * 1000
  });

  // const
  const composer = assignment?.part?.piece?.composer?.name;
  const composerCheat = composer?.split(' ').pop();
  const connectLink = `Connect ${composerCheat}`;
  const pieceAssignments = assignments?.[piece];

  if (!pieceAssignments && isLoading) {
    return <Nav.Item><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      variant="light"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner></Nav.Item>
  }

  return pieceAssignments ? <Nav.Item><Form><Form.Select onChange={changeActivity} defaultValue={currentRouteSuffix}>
    <option value="">Choose an activity</option>
    {pieceAssignments.map((assn) => (<option key={assnToKey(assn)} value={assnToKey(assn)}>{assnToContent(assn)}</option>))}
  </Form.Select></Form></Nav.Item> : null
}

export {NavActivityPicker, assnToKey, assnToContent};