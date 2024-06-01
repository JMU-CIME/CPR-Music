import Link from "next/link";
import { useRouter } from "next/router";
import { ListGroup } from "react-bootstrap";
import { FaBook, FaDrum, FaGuitar, FaLink, FaPenFancy } from "react-icons/fa";
import { getMySubmissionsForAssignment } from "../../api";
import { useQuery } from "react-query";

function ActivityPicker (assignment) {
  const router = useRouter();

  const { slug, piece, actCategory = 'Create', partType } = router.query;

  const {
    isLoading,
    isIdle,
    error,
    data: submissions,
  } = useQuery(
    ['submissions', slug, assignment.id],
    () => getMySubmissionsForAssignment({ slug, assignmentId: assignment.id }),
    {
      enabled: !!assignment && !!slug && !!assignment.id,
    }
  );

  // const
  const composer = assignment?.part?.piece?.composer?.name;
  const composerCheat = composer?.split(' ').pop();
  const connectLink = `Connect ${composerCheat}`;
  const hasCompose = ['Benjamin', 'Danyew', 'Green'].includes(composerCheat);
return <ListGroup>
  <Link
    href={`/courses/${slug}/${piece}/Perform/Melody`}
    passHref legacyBehavior
  >
    <ListGroup.Item
      action
      eventKey="Melody"
      href={`/courses/${slug}/${piece}/Perform/Melody`}
      active={
        actCategory === 'Perform' && partType === 'Melody'
      }
      as="a"
    >
      <span>
        <FaGuitar /> Melody
      </span>
    </ListGroup.Item>
  </Link>
  <Link
    href={`/courses/${slug}/${piece}/Perform/Bassline`}
    passHref legacyBehavior
  >
    <ListGroup.Item
      action
      eventKey="Bassline"
      href={`/courses/${slug}/${piece}/Perform/Bassline`}
      active={
        actCategory === 'Perform' && partType === 'Bassline'
      }
      as="a"
    >
      <span>
        <FaDrum /> Bassline
      </span>
    </ListGroup.Item>
  </Link>
  <Link href={`/courses/${slug}/${piece}/Create`} passHref legacyBehavior>
    <ListGroup.Item
      action
      eventKey="Create"
      href={`/courses/${slug}/${piece}/Create`}
      active={actCategory === 'Create'}
      as="a"
    >
      <span>
        <FaPenFancy /> Create
      </span>
    </ListGroup.Item>
  </Link>
  <Link href={`/courses/${slug}/${piece}/Respond`} passHref legacyBehavior>
    <ListGroup.Item
      action
      eventKey="Respond"
      href={`/courses/${slug}/${piece}/Respond`}
      active={actCategory === 'Respond'}
      as="a"
    >
      <span>
        <FaBook /> Reflect
      </span>
    </ListGroup.Item>
  </Link>
  {/* FIXME: why isn't this hasCompose doc'ed?! this should be solved better */}
  {hasCompose && (
    <Link
      href={`/courses/${slug}/${piece}/${connectLink}`}
      passHref legacyBehavior
    >
      <ListGroup.Item
        action
        eventKey="Connect"
        href={`/courses/${slug}/${piece}/${connectLink}`}
        active={actCategory === 'Connect'}
        as="a"
      >
        <span>
          <FaLink /> Connect
        </span>
      </ListGroup.Item>
    </Link>
  )}
</ListGroup>
}

export default ActivityPicker;