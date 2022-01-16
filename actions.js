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
