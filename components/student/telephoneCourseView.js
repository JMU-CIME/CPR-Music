import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import TranspositionBadge from '../transpositionBadge';
import { getStudentAssignments, getTelephoneGroup } from '../../api';
import { ProgressBar } from 'react-bootstrap';
// on the student's course view:
// show the name of the course
// show the assignments that still need to be completed
// show the assignments that have already been completed

export default function StudentTelephoneCourseView({ enrollment }) {
  const [sortedTelephoneGroup, setSortedTelephoneGroup] = useState([]);
  const { groupIsLoading, error, data: telephoneGroup } = useQuery('telephoneGroup', getTelephoneGroup);
  const router = useRouter();
  const { slug } = router.query;
  const {
    isLoading,
    error: assignmentsError,
    data: assignments,
  } = useQuery('assignments', getStudentAssignments(slug), {
    enabled: !!slug,
  });

  useEffect(() => {
    if (telephoneGroup && sortedTelephoneGroup)
      setSortedTelephoneGroup(Object.entries(telephoneGroup)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([act_type, value]) => ({ ...value, act_type })));
  }, [telephoneGroup]);

  const activitySort = (a, b) => {
    const ordering = {
      Melody: 1,
      Bassline: 2,
      Creativity: 3,
      Reflection: 4,
      Connect: 5,
    };
    const c = a.activity.activity_type.name.split(' ')[0];
    const d = b.activity.activity_type.name.split(' ')[0];
    return ordering[c] - ordering[d];
  };

  // TODO this only supports one telephone assingment right now
  function progressAmount() {
    // console.log("telephoneGroup --> ", telephoneGroup);
    const total = 3;
    let finished = 0;
    if (telephoneGroup.Melody.audio)
      finished++;
    if (telephoneGroup.Bassline.audio)
      finished++;
    if (telephoneGroup.Creativity.audio)
      finished++;
    return Math.round(finished / total * 100);
  };

  function getAssignment(assignment) {
    // console.log('assignments', assignments);
    return assignment.activity.part_type;
  }

  function isTelephoneAssignment(assignment) {
    return assignment.activity.activity_type.category === "Telephone";
  }

  function isTelephonePiece(piece) {
    // console.log('piece --> ', piece);
    for (const i in piece) {
      if (isTelephoneAssignment(piece[i]))
        return true;
    }
    return false;
  }

  function assignmentIsDone() {
    // TODO check if the assignment is done
    return false;
  }

  return (
    <Row>
      <Col>
        <h2>Telephone Status</h2>
        {/* <div className="student-assignments"> */}
        <div className="d-flex align-items-start flex-wrap gap-3">
          {/* eslint-disable no-nested-ternary */}
          {(isLoading || groupIsLoading) ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : assignments && Object.keys(assignments).length > 0 ? (
            Object.keys(assignments).map((pieceName) => (
              isTelephonePiece(assignments[pieceName]) && (
                <Card className="student-piece-activity-group w-100" key={pieceName}>
                  <Card.Header className="fw-bold"><h5>{pieceName}</h5></Card.Header>
                  {assignments[pieceName].sort(activitySort).map((assignment) => (
                    isTelephoneAssignment(assignment) && (
                      <>
                        <div className="row align-items-start px-3 py-2">
                          <div className='col-md-8 d-flex'>
                            <h6>Your Assignment: <b>{getAssignment(assignment)}</b></h6>
                            {/* {getTelephoneEntry && */}
                              <a className="link-btn" href={`${enrollment.course.slug}/${assignment.part.piece.slug
                                }/${assignment.activity.activity_type.category}${assignment.activity.activity_type.category ===
                                  'Perform'
                                  ? `/${assignment.activity.part_type}`
                                  : ''
                                }`}>
                                {assignmentIsDone() ? "Redo" : "Complete"} {getAssignment(assignment)} Assignment
                              </a>
                            {/* } */}
                            <a className="link-btn" href="fake.url">
                              {/* TODO What url to put here? */}
                              Complete Reflect Assignment
                            </a>
                            <a className="link-btn" href="fake.url">
                              {/* TODO What url to put here? */}
                              Listen to Them All Together
                            </a>
                            {/* <button
                                type="button"
                                class="btn btn-primary"
                                onclick="window.location.href='https://w3docs.com';"
                              >
                                Complete {getAssignment(assignment)} Assignments
                              </button> */}
                          </div>
                          <div className='col-lg-3'>
                          </div>
                        </div>
                        <div className='container'>
                          <div className='row'>
                            {sortedTelephoneGroup.map((groupMember) => (
                              <div className='col-4 telephone-group-entry'>
                                <h6>
                                  {groupMember.user.name}
                                </h6>
                                <strong>{groupMember.audio ? "Finished" : "Not Finished"}</strong>
                                {/* TODO Say if they're finished */}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className='row px-5 py-4'>
                          <ProgressBar now={progressAmount()} label={`${progressAmount()}%`} />
                        </div>
                      </>
                    )
                  ))}
                </Card>
              )))
          ) : (
            <p>You have no assignments at this time.</p>
          )}
        </div>
      </Col>
    </Row>
  );
}


