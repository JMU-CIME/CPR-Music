/* eslint-disable camelcase */
import * as types from './types';

// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
}

export function gotEnrollments(courses) {
  return {
    type: types.Action.GotEnrollments,
    payload: courses,
  };
}

export function retrieveEnrollments(djangoToken) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`, {
    headers: {
      Authorization: `Token ${djangoToken}`,
      'Content-Type': 'application/json',
    },
  }).then((response, ...rest) => {
    const results = response.json();
    return results;
  });
}

export function fetchEnrollments() {
  console.info('fetchEnrollments');
  return (dispatch, getState) => {
    const { currentUser: {token} } = getState();
    console.log('fetchEnrollments has token:', token)
    return token
      ? retrieveEnrollments(token)
        .then((courses) => dispatch(gotEnrollments(courses)))
        .catch((...rest) => {
          console.log('catch rest');
          console.log(rest);
        })
      : null;
  };
}

export const newCourse =
  ({
    name,
    startDate: start_date,
    endDate: end_date,
    slug = 'slug',
    userId,
  }) =>
    (dispatch, getState) => {
      const {
        currentUser: { token }
      } = getState();
      const params = {
        name,
        start_date,
        end_date,
        slug,
        owner: userId,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(params),
      };

      const enrollOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/`, options)
        .then(assertResponse)
        .then((response) => response.json())
        .then((data) => {
          console.log('data from create course post', data);
          const enrollParams = {
            user: userId,
            role: 1,
            course: data.id,
          };
          enrollOptions.body = JSON.stringify(enrollParams);
          console.log(enrollOptions);
          return fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`,
            enrollOptions
          );
        })
        .then(() => dispatch(fetchEnrollments()));
    };

export function addedFromRoster(courseSlug, enrollments) {
  return {
    type: types.Action.AddedRoster,
    payload: {
      courseSlug,
      enrollments,
    },
  };
}

export function uploadRoster({ body, courseSlug }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token }
    } = getState();
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${courseSlug}/roster/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
        method: 'POST',
        body,
      }
    )
      .then(assertResponse)
      .then((response) => response.json())
      .then((res) => {
        console.log('uploaded', res);
        dispatch(addedFromRoster(courseSlug, res));
      });
  }
}

export function gotInstruments(instruments) {
  return {
    type: types.Action.GotInstruments,
    payload: instruments,
  };
}

export function fetchInstruments() {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/instruments/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(assertResponse)
      .then((response) => response.json())
      .then((instruments) => {
        console.log('instruments', instruments);
        return dispatch(
          gotInstruments(instruments.sort((a, b) => (a.name < b.name ? -1 : 1)))
        );
      });
  }
}

export function gotRoster(enrollments) {
  return {
    type: types.Action.GotRoster,
    payload: enrollments,
  };
}

export function fetchRoster({ courseSlug }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${courseSlug}/roster/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((enrollments) => dispatch(gotRoster(enrollments)));
  }
}

export function enrollmentUpdated({ enrollment, instrument }) {
  return {
    type: types.Action.UpdatedEnrollmentInstrument,
    payload: {
      enrollment,
      instrument,
    },
  };
}

export function setInstrumentActivity(enrollmentId, activityState) {
  return {
    type: types.Action.SetInstrumentActive,
    payload: { enrollmentId, activityState },
  };
}

export function updateEnrollmentInstrument({
  enrollmentId,
  instrument,
}) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    dispatch(setInstrumentActivity(enrollmentId, types.ActivityState.Active));
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/${enrollmentId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ instrument: instrument.id }),
      }
    )
      .then(assertResponse)
      .then((res) => res.json())
      .then((enrollment) => {
        dispatch(
          setInstrumentActivity(enrollmentId, types.ActivityState.Success)
        );
        dispatch(enrollmentUpdated({ enrollment, instrument }));
      })
      .catch(() => {
        dispatch(
          setInstrumentActivity(enrollmentId, types.ActivityState.Erroneous)
        );
      });
  };
}

export function gotAssignments(assignments) {
  return {
    type: types.Action.GotAssignments,
    payload: assignments,
  };
}

export function fetchStudentAssignments({ slug }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((assignments) => dispatch(gotAssignments(assignments)));
  }
}

export function loggedOut() {
  return {
    type: types.Action.LoggedOut,
  };
}

export function logoutUser() {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth-token`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(assertResponse)
      .then((res) => res.json())
      .then(loggedOut);
  }
}

export function gotActivities({ activities, slug }) {
  return {
    type: types.Action.GotActivities,
    payload: {
      activities,
      slug,
    },
  };
}

export function fetchActivities({ slug }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then(assertResponse)
      .then((response) => response.json())
      .then((activities) => dispatch(gotActivities({ activities, slug })));
  }
}

export function gotPieces(pieces) {
  return {
    type: types.Action.GotPieces,
    payload: pieces,
  };
}

export function fetchPieces() {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/pieces/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(assertResponse)
      .then((response) => response.json())
      .then((pieces) => {
        console.log('pieces', pieces);
        dispatch(gotPieces(pieces.sort((a, b) => (a.name < b.name ? -1 : 1))));
      });
  }
}

export function assignedPiece({ piece, slug }) {
  return {
    type: types.Action.AssignedPiece,
    payload: { piece, slug },
  };
}

export function unassignedPiece({ piece, slug }) {
  console.log('unassignedPiece({piece, slug})', piece, slug);
  return {
    type: types.Action.UnassignedPiece,
    payload: { piece, slug },
  };
}

export function assignPiece({ slug, piece }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    // const data = new FormData();
    // data.append("piece_id", piece);
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assign/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ piece_id: piece.id }),
        // body: data,
      }
    )
      .then(assertResponse)
      .then((response) => response.json())
      .then((pieceResponse) => dispatch(assignedPiece({ piece, slug })));
  }
}

export function setPieceChangeState({ piece, state }) {
  return {
    type: types.Action.SetPieceChangeState,
    payload: { piece, state },
  };
}

export function unassignPiece({ piece, slug }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    dispatch(
      setPieceChangeState({
        pieceId: piece.id,
        state: types.ActivityState.Active,
      })
    );
    // const data = new FormData();
    // data.append("piece_id", piece);
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/unassign/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ piece_id: piece.id }),
        // body: data,
      }
    )
      .then(assertResponse)
      .then(() => dispatch(unassignedPiece({ piece, slug })))
      .then(() =>
        dispatch(
          setPieceChangeState({
            pieceId: piece.id,
            state: types.ActivityState.Success,
          })
        )
      )
      .catch((err) => {
        console.log('caught error in unassign', err);
        dispatch(
          setPieceChangeState({
            pieceId: piece.id,
            state: types.ActivityState.Erroneous,
          })
        );
      });
  };
}

export function gotUser(userInfo) {
  return {
    type: types.Action.HaveUser,
    payload: userInfo,
  };
}

export function gotMyProfile(myProfile) {
  return {
    type: types.Action.GotProfile,
    payload: myProfile,
  };
}

export function getUserProfile() {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/users/me/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(assertResponse)
      .then((response, ...rest) => {
        const results = response.json();
        return results;
      })
      .then((myProfile) => dispatch(gotMyProfile(myProfile)));
  }
}

export function selectEnrollment(enrollment) {
  return {
    type: types.Action.SelectedEnrollment,
    payload: enrollment,
  };
}

export function selectAssignment(assignment) {
  return {
    type: types.Action.SelectedAssignment,
    payload: assignment,
  };
}

export function postRecording({ slug, assignmentId, audio }) {
  console.log('postRecording');
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    console.log('posting... audio, token, slug, assignmentId, ');
    console.log('posting...', audio, token, slug, assignmentId);
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/${assignmentId}/submissions/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
        method: 'POST',
        body: audio,
      }
    )
      .then(assertResponse)
      .then((res) => res.json())
      .then((submission) => {
        console.log('new submission', submission);
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/${assignmentId}/submissions/${submission.id}/attachments/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
            method: 'POST',
            body: audio,
          }
        )
          .then(assertResponse)
          .then((response) => response.json())
          .then((res) => {
            console.log('uploaded recording', res);
            // dispatch(addedFromRoster(courseSlug, res));
          });
      });
  };
}

export function gotSingleStudentAssignment(assignment) {
  return {
    type: types.Action.GotSingleAssignment,
    payload: assignment,
  };
}

export function fetchSingleStudentAssignment({ slug, assignmentId }) {
  return (dispatch, getState) => {
    const {
      currentUser: { token },
    } = getState();
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/${assignmentId}`,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then(assertResponse)
      .then((response) => response.json())
      .then((assignment) => dispatch(selectAssignment(assignment)));
  }
}
