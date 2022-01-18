import { useSession } from "next-auth/react";
import * as types from "./types";

// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

export const loggedIn = (data) => ({ type: types.LOGGED_IN, payload: data });

export const newCourse =
  ({
    name,
    startDate: start_date,
    endDate: end_date,
    slug = "slug",
    token = "",
  }) =>
  (dispatch) => {
    const params = {
      name,
      start_date,
      end_date,
      slug,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(params),
    };
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/`, options)
      .then(assertResponse)
      .then(() => dispatch(fetchEnrollments(token)));
  };

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
      "Content-Type": "application/json",
    },
  }).then((response, ...rest) => {
    const results = response.json();
    return results;
  });
}

export function fetchEnrollments(djangoToken) {
  return (dispatch) => {
    return djangoToken
      ? retrieveEnrollments(djangoToken)
          .then((courses) => dispatch(gotEnrollments(courses)))
          .catch((...rest) => {
            console.log("catch rest");
            console.log(rest);
          })
      : null;
  };
}

export function addedFromRoster(courseSlug, enrollments) {
  return {
    type: types.Action.AddedRoster,
    payload: {
      courseSlug,
      enrollments,
    },
  };
}

export function uploadRoster({ body, djangoToken, courseSlug }) {
  return (dispatch) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${courseSlug}/roster/`,
      {
        headers: {
          Authorization: `Token ${djangoToken}`,
        },
        method: "POST",
        body,
      }
    )
      .then(assertResponse)
      .then((response) => response.json())
      .then((res) => {
        console.log("uploaded", res);
        dispatch(addedFromRoster(courseSlug, res));
      });
  };
}

export function gotInstruments(instruments) {
  return {
    type: types.Action.GotInstruments,
    payload: instruments,
  };
}

export function fetchInstruments(djangoToken) {
  return (dispatch) => {
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/instruments/`, {
      headers: {
        Authorization: `Token ${djangoToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((instruments) =>
        dispatch(
          gotInstruments(instruments.sort((a, b) => (a.name < b.name ? -1 : 1)))
        )
      );
  };
}

export function gotRoster(enrollments) {
  return {
    type: types.Action.GotRoster,
    payload: enrollments,
  };
}

export function fetchRoster({ djangoToken, courseSlug }) {
  return (dispatch) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${courseSlug}/roster/`,
      {
        headers: {
          Authorization: `Token ${djangoToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((enrollments) => dispatch(gotRoster(enrollments)));
  };
}

export function enrollmentUpdated(enrollment) {
  return {
    type: types.Action.UpdatedEnrollmentInstrument,
    payload: {
      enrollment,
    },
  };
}

export function updateEnrollmentInstrument({
  djangoToken,
  enrollmentId,
  instrumentId,
}) {
  return (dispatch) =>
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/${enrollmentId}/`,
      {
        headers: {
          Authorization: `Token ${djangoToken}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ instrument: instrumentId }),
      }
    )
      .then(assertResponse)
      .then((res) => res.json())
      .then((enrollment) => dispatch(enrollmentUpdated(enrollment)));
}

export function gotAssignments(assignments) {
  return {
    type: types.Action.GotAssignments,
    payload: assignments,
  };
}

export function fetchStudentAssignments({ token, slug }) {
  return (dispatch) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((assignments) => dispatch(gotAssignments(assignments)));
  };
}

export function loggedOut() {
  return {
    type: types.Action.LoggedOut,
  };
}

export function logoutUser(token) {
  return (dispatch) =>
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth-token`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(assertResponse)
      .then((res) => res.json())
      .then(loggedOut);
}

export function gotActivities(activities) {
  return {
    type: types.Action.GotActivities,
    payload: activities,
  };
}

export function fetchActivities({ token, slug }) {
  return (dispatch) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((activities) => dispatch(gotActivities(activities)));
  };
}

export function gotPieces(pieces) {
  return {
    type: types.Action.GotPieces,
    payload: pieces,
  };
}

export function fetchPieces(djangoToken) {
  return (dispatch) => {
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/pieces/`, {
      headers: {
        Authorization: `Token ${djangoToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((pieces) =>
        dispatch(gotPieces(pieces.sort((a, b) => (a.name < b.name ? -1 : 1))))
      );
  };
}

export function assignedPiece(piece) {
  return {
    type: types.Action.AssignedPiece,
    payload: piece,
  };
}

export function assignPiece({ djangoToken, slug, piece }) {
  return (dispatch) => {
    // const data = new FormData();
    // data.append("piece_id", piece);
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assign/`,
      {
        headers: {
          Authorization: `Token ${djangoToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ piece_id: piece }),
        // body: data,
      }
    )
      .then(assertResponse)
      .then((response) => response.json())
      .then((pieceResponse) => dispatch(assignedPiece(pieceResponse)));
  };
}
