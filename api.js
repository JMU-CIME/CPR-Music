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

async function makeRequest(endpoint, method="GET", body=null, headers={}) {
  const token = await getDjangoToken();
  if (!token) return {};

  const requestHeaders = {
    ...headers,
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json',
  }

  const API = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api`;
  const url = `${API}/${endpoint}` 

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
  const endpoint = "enrollments/";
  const json = await makeRequest(endpoint);
  return json;
}

export function getStudentAssignments(slug) {
  return async () => {
    const endpoint = `courses/${slug}/assignments/`;
    const json = await makeRequest(endpoint);
    return json
  }
}

export function getAllPieces(slug) {
  return async () => {
    const endpoint = `courses/${slug}/piece-plans/`;
    const json = await makeRequest(endpoint);
    return json.map((r) => ({...r.piece, piece_plan_id: r.id}));
  }
}

export function mutateAssignPiece(slug) {
  return async (piecePlanId) => {
    const endpoint = `courses/${slug}/assign_piece_plan/`
    const json = await makeRequest(endpoint, 'POST', {piece_id: piecePlanId})
    return json
  }
}

export function mutateUnassignPiece(slug) {
  return async (piece) => {
    const endpoint = `courses/${slug}/unassign/`
    const json = await makeRequest(endpoint, 'POST', {piece_id: piece.id});
    return json
  }
}

export function getRecentSubmissions({ slug, piece, partType }) {
  return async () => {
    const endpoint = `courses/${slug}/submissions/recent/?piece_slug=${piece}&activity_name=${partType}`;
    const json = await makeRequest(endpoint);
    return json;
  }
}

export function mutateGradeSubmission(slug) {
  return async ({ student_submission, rhythm, tone, expression, grader }) => {
    const endpoint = `courses/${slug}/grades/`;
    const body = {
      student_submission: [student_submission],
      own_submission: [],
      rhythm,
      tone,
      expression,
      grader
    };
    
    const json = await makeRequest(endpoint, 'POST', body);
    
    return json;
  }
}

// should i make this mutator optionally have a recording or??
export function mutateCreateSubmission({ slug }) {
  return async (submission, assignmentId) => {
    const endpoint = `courses/${slug}/assignments/${assignmentId}/submissions/`
    
    const json = await makeRequest(endpoint, 'POST', submission)
    
    return json;
  }
}

export async function getMySubmissionsForAssignment({ slug, assignmentId }) {
  const endpoint = `courses/${slug}/assignments/${assignmentId}/submissions/`
  const json = await makeRequest(endpoint);
  return json;
}

export function mutateCourse(slug) {
  // expecting params to be any subset of name, start_date, end_date, slug
  return async (params) => {
    const endpoint = `courses/${slug}/`
    
    const json = await makeRequest(endpoint, 'PATCH', params);
    
    return json;
  }
}
    
export async function mutateAssignmentInstrument(slug, pieceId, instrument) {
  const endpoint = `courses/${slug}/change_piece_instrument/`;
  const body = {piece_id: pieceId, instrument_id: instrument.id};
  
  const json = await makeRequest(endpoint, 'PATCH', body);
  
  return json;
}

export function getAssignedPieces(assignments) {
  return () => {
    const pieces = {};
    if (Object.values(assignments).length == 0) return pieces;
    
    for (const pieceKey of Object.keys(assignments)) {
      for (const pieceAssignment of assignments[pieceKey]) {
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
    return pieces;
  };
}

