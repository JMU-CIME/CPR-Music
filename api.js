/* eslint-disable no-restricted-syntax */
import { getSession } from 'next-auth/react';
// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
}


async function getDjangoToken() {
  const session = await getSession();
  if (!session || !session.djangoToken) return;
  return session.djangoToken
}

async function makeRequest(url, method="GET", body=null, headers={}) {
  const token = await getDjangoToken();
  if (!token) return {};

  const requestHeaders = {
    ...headers,
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json',
  }

  const API = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api`;
  url = `${API}/${url}` 

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : null
  })

  assertResponse(response);

  const data = await response.json();
  return data;
}


export async function getEnrollments() {
  const url = "enrollments/";
  const json = await makeRequest(url);
  return json;
}


export function getStudentAssignments(slug) {
  return async () => {
    const url = `courses/${slug}/assignments/`;
    const json = await makeRequest(url);
    return json
  }
}

export function getAllPieces(courseSlug) {
  return () =>
    getSession().then((session) => {
      const token = session.djangoToken;
      // return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/pieces/`, {
      // http://localhost:8000/api/courses/6th-grade-band/piece-plans/
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${courseSlug}/piece-plans/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
        .then(assertResponse)
        .then((response) => response.json())
        .then((json) => {
          const result = json;
          return result.map((r) => ({...r.piece, piece_plan_id: r.id}));
        });
    });
}
export function getAssignedPieces(assignments) {
  return () => {
    const pieces = {};
    if (Object.values(assignments).length > 0) {
      for (const pieceKey of Object.keys(assignments)) {
        for (const pieceAssignment of assignments[pieceKey]) {
          //   pieces[pieceAssignment.part.piece.id] = pieceAssignment.part.piece;
          // }
          if (!(pieceKey in pieces)) {
            pieces[pieceKey] = {
              id: pieceAssignment.piece_id,
              name: pieceAssignment.piece_name,
              activities: {},
              slug: pieceAssignment.piece_slug,
            };
          }
          const actType = pieceAssignment.activity_type_name;
          const actCat = pieceAssignment.activity_type_category;
          pieces[pieceKey].activities[`${actCat}-${actType}`] = {
            name: actType,
            category: actCat,
          };
        }
      }
    }
    return pieces;
  };
}

export function mutateAssignPiece(slug) {
  return (piecePlanId) =>
    getSession().then((session) => {
      const token = session.djangoToken;
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assign_piece_plan/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ piece_plan_id: piecePlanId }),
          // body: data,
        }
      )
        .then(assertResponse)
        .then((response) => response.json());
    });
}
export function mutateUnassignPiece(slug) {
  return (piece) =>
    getSession().then((session) => {
      const token = session.djangoToken;
      return fetch(
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
      );
    });
}
export function getRecentSubmissions({ slug, piece, partType }) {
  return () =>
    getSession().then((session) => {
      const token = session.djangoToken;
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/submissions/recent/?piece_slug=${piece}&activity_name=${partType}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
        .then(assertResponse)
        .then((response) => response.json())
    });
}

export function mutateGradeSubmission(slug) {
  return ({ student_submission, rhythm, tone, expression, grader }) =>
    getSession().then((session) => {
      const token = session.djangoToken;
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/grades/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            student_submission: [student_submission],
            own_submission: [],
            rhythm,
            tone,
            expression,
            grader,
          }),
          // body: data,
        }
      )
        .then(assertResponse)
        .then((response) => response.json());
    });
}
// should i make this mutator optionally have a recording or??
export function mutateCreateSubmission({ slug }) {
  return (submission, assignmentId) =>
    getSession()
      .then((session) => {
        const token = session.djangoToken;
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/${assignmentId}/submissions/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(submission),
          }
        );
      })
      .then(assertResponse)
      .then((res) => res.json());
}

export function getMySubmissionsForAssignment({ slug, assignmentId }) {
  return getSession()
    .then((session) => {
      const token = session.djangoToken;
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/${assignmentId}/submissions/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    })
    .then(assertResponse)
    .then((response) => response.json())
}

export function mutateCourse(slug) {
  // expecting params to be any subset of name, start_date, end_date, slug
  return (params) => {
    return getSession().then((session) => {
      const token = session.djangoToken;
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify(params),
          // body: data,
        }
      )
        .then(assertResponse)
        .then((response) => response.json());
    });
  };
}


export async function mutateAssignmentInstrument(slug, pieceId, instrument) {
  const session = await getSession();
  const token = session.djangoToken;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/change_piece_instrument/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({piece_id: pieceId ,instrument_id: instrument.id})
    }
  );
  
  assertResponse(response);
}

