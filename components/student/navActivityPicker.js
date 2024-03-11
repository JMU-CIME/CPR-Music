import Link from "next/link";
import { useRouter } from "next/router";
import { Form, ListGroup, Nav, Spinner } from "react-bootstrap";
import { FaBook, FaDrum, FaGuitar, FaLink, FaPenFancy } from "react-icons/fa";
import { useQuery } from "react-query";
import { getStudentAssignments } from "../../api";

function NavActivityPicker (assignment) {
  let activity;
  
  const router = useRouter();

  const { slug, piece, actCategory = 'Create', partType } = router.query;

  let currentActivity = actCategory;
  console.log('router.asPath', router.asPath)
  let currentRouteSuffix = router.asPath.substring(`/courses/${slug}/${piece}/`.length);
  console.log('currentRouteSuffix', currentRouteSuffix);
  
  const changeActivity = (ev) => {
    console.log('changeActivity = (ev', ev);
    router.push(`/courses/${slug}/${piece}/${ev.target.value}`)
  }

  const {
      isLoading,
      error: assignmentsError,
      data: assignments,
    } = useQuery('assignments', getStudentAssignments(slug), {
      enabled: !!slug,
    });

  // const
  const composer = assignment?.part?.piece?.composer?.name;
  const composerCheat = composer?.split(' ').pop();
  const connectLink = `Connect ${composerCheat}`;
  const hasCompose = ['Benjamin', 'Danyew', 'Green'].includes(composerCheat);
  const pieceAssignments = assignments?.[piece];

  // FIXME: probably should not need this function at all, this info should probably have come from the backend?
  function assnToKey (assignment) {
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
    } else if(assignment.activity_type_category.startsWith('Connect')) {
      return 'Connect';
    } else {
      return assignment.activity_type_category;
    }
  }

  // FIXME: probably should not need this function at all, this info should probably have come from the backend?
  function assnToContent(assignment) {
    // let performIcon = '<FaGuitar />'
    // if (assignment.activity_type_name === 'Bassline') {
    //   performIcon = '<FaDrum />'
    // }
    
    let assnTypeCat = assignment.activity_type_category;
    if (assnTypeCat.startsWith('Perform') || assnTypeCat.startsWith('Connect')) {
      assnTypeCat = assnTypeCat.substring(0, 'Perform'.length);
    }

    const contentByType = {
      // 'Perform': `${performIcon} ${assignment.activity_type_name}`,
      // 'Create': `<FaPenFancy /> ${assignment.activity_type_name}`,
      // 'Respond':`<FaBook /> ${assignment.activity_type_name}`,
      // 'Connect': `<FaLink /> ${assnTypeCat}`,
      'Perform': `${assignment.activity_type_name}`,
      'Create': `${assignment.activity_type_name}`,
      'Respond':`${assignment.activity_type_name}`,
      'Connect': `${assnTypeCat}`,
    }

    return contentByType[assnTypeCat];

  }

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

  return pieceAssignments ? <Nav.Item><Form inline><Form.Select onChange={changeActivity} defaultValue={currentRouteSuffix}>
    <option value="">Choose an activity</option>
  {pieceAssignments.map((assn) =>  (<option key={assnToKey(assn)} value={assnToKey(assn)}>{assnToContent(assn)}</option>) )}
  </Form.Select></Form></Nav.Item> : null
}

export default NavActivityPicker;