import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaMarker, FaTrash } from 'react-icons/fa';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { assignPiece, unassignPiece } from '../../actions';
import Link from 'next/link';
import { getAssignedPieces, getAllPieces, mutateUnassignPiece, mutateAssignPiece } from '../../api';

// for the teacher, it should:
// 1. permit assigning of pieces
// 2. permit export grades
// 3. invite to grade an assignment (this is weird bc it's at a level below piece while #1 is at the piece level)
// 

// export default function TeacherCourseView({
//   assignedPieces,
//   pieces,
//   assignments,
// }) {
export default function TeacherCourseView(){
  const queryClient = useQueryClient()
  const router = useRouter();
  const { slug } = router.query;
  const { isLoading, error, data: allPieces } = useQuery('allPieces', getAllPieces)
  const { isLoadingAssignedActs, errorAssignedActs, data: assignedPieces } = useQuery('assignedPieces', getAssignedPieces(slug))
  const unassignMutation = useMutation(mutateUnassignPiece(slug),  {
    onMutate: async (unassignedPiece) => {
      console.log('unassignedPiece', unassignedPiece)
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('assignedPieces')
      // Snapshot the previous value
      const previousAssigned = queryClient.getQueryData('assignedPieces')
      // Optimistically update to the new value
      queryClient.setQueryData('assignedPieces', old =>  {console.log("old", old); const updated = old; delete updated[unassignedPiece.slug]; return updated});
      // Return a context object with the snapshotted value
      return { previousAssigned }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, unassignedPiece, context) => {
      queryClient.setQueryData('assignedPieces', context.previousAssigned)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('assignedPieces')
    },
  });
  const unassign = (piece) => unassignMutation.mutate(piece)

  const assignMutation = useMutation(mutateAssignPiece(slug), {
    onMutate: async (newPiece) => {
      console.log('newPiece', newPiece)
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('assignedPieces')
      // Snapshot the previous value
      const previousAssigned = queryClient.getQueryData('assignedPieces')
      // Optimistically update to the new value
      queryClient.setQueryData('assignedPieces', old => {console.log('old', old); return {...old, [newPiece.slug]:newPiece}})
      // Return a context object with the snapshotted value
      return { previousAssigned }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newPiece, context) => {
      queryClient.setQueryData('assignedPieces', context.previousAssigned)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('assignedPieces')
    },
  });
  const assign = (piece) => assignMutation.mutate(piece)
  if (isLoading || isLoadingAssignedActs || !assignedPieces) return 'Loading...'
  if (error || errorAssignedActs) return `An error has occurred: ${  error?.message ?? errorAssignedActs?.message}`
  
  console.log('assigned', assignedPieces)

  return (
    <Row>
      <Col>
        <h2>Assign New Piece</h2>
        <ListGroup>
          {allPieces &&
            allPieces.filter(
              (piece) =>
                assignedPieces &&
                  Object.values(assignedPieces).findIndex(
                    (assignedPiece) => assignedPiece.id === piece.id
                  ) === -1
            )
              .map((piece) => (
                <ListGroupItem
                  key={piece.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>{piece.name}</div>
                  <Button onClick={()=>assign(piece)}>
                    Assign <FaPlus />
                  </Button>
                </ListGroupItem>
              ))}
        </ListGroup>
      </Col>
      <Col>
        <h2>Assigned Pieces</h2>
        {/* <ListGroup>
          {assignedPieces && Object.values(assignedPieces).length > 0 ? (
            Object.values(assignedPieces).map((piece) => (
              <ListGroupItem
                key={piece.id}
                className="d-flex justify-content-between"
              >
                {piece.name}
                <Button variant="danger" onClick={() => {console.log('unassign click', piece);unassign(piece)}}>
                  Delete
                </Button>
              </ListGroupItem>
            ))
          ) : (
            <p>There are no pieces assigned to this course.</p>
          )}
        </ListGroup> */}
        
        {assignedPieces && Object.values(assignedPieces).length > 0 ? (
          <Accordion defaultActiveKey={Object.values(assignedPieces)[0]} alwaysOpen>
            { Object.values(assignedPieces).map((piece) => (
              <Accordion.Item eventKey={piece.id} key={piece.id}>
                <Accordion.Header>{piece.name}</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={9}>
                      <ListGroup>
                        {piece.activities && Object.values(piece.activities).length > 0 ? (
                          Object.keys(piece.activities).map((activityKey) => (
                            <ListGroupItem
                              key={activityKey}
                              className="d-flex justify-content-between"
                            >
                              <span className='me-auto'>{`${piece.activities[activityKey].category} ${piece.activities[activityKey].name}`}</span>
                              <Link href={`/courses/${slug}/${piece.slug}/${piece.activities[activityKey].category}/${piece.activities[activityKey].name}/grade`} passHref>
                                <a className="btn btn-primary">Grade <FaMarker /></a>
                              </Link>
                              {/* <Button variant="danger" onClick={() => {console.log('unassign click', piece);unassign(piece)}}>
                                  Delete
                                </Button> */}
                            </ListGroupItem>
                          ))
                        ) : (
                          <p>There are no pieces assigned to this course.</p>
                        )}
                      </ListGroup>
                    </Col>
                    <Col style={{textAlign: 'center'}}>
                      <Button variant="danger" onClick={() => {console.log('unassign click', piece);unassign(piece)}}>
                        Delete <FaTrash/>
                      </Button>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : <p>no assigned pieces</p>}        
      </Col>
    </Row>
  );
}
