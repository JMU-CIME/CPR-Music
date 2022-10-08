import { getSession } from 'next-auth/react';
// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
}
export function getEnrollments() {
  return getSession().then((session) => {
    if (!session || !session.djangoToken) {
      return {};
    }
    const token = session.djangoToken;
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((response, ...rest) => {
      const results = response.json();
      return results;
    });
  });
}

export function getStudentAssignments(slug) {
  return () => {
    console.log('getStudentAssignments');
    return getSession()
      .then((session) => {
        const token = session.djangoToken;
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      })
      .then((response) => response.json())
      .then((results) => {
        console.log('results', results);
        return results;
      })
      .then((results) => {
        const grouped = results.reduce((acc, obj) => {
          const key = obj.part.piece.name;
          if (!acc[key]) {
            acc[key] = [];
          }
          // Add object to list for given key's value
          acc[key].push(obj);
          return acc;
        }, {});
        // for (let piece of Object.keys(grouped)) {
        //   grouped[piece].sort((a, b) => {
        //     return a.activity.activity_type.order - b.activity.activity_type.order;
        //   });
        // }
        console.log('grouped', grouped);
        return grouped;
        // Object.keys(grouped).sort()
      });
  };
}

export function getAllPieces() {
  // console.log('begin: getAllPieces')
  return getSession().then((session) => {
    const token = session.djangoToken;
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/pieces/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(assertResponse)
      .then((response) =>
        // console.log('end: getAllPieces')
        response.json()
      );
  });
}
export function getAssignedPieces(assignments) {
  return () => {
    console.log('getAssignedPieces', assignments);
    const pieces = {};
    assignments.forEach((assignment) => {
      const pieceSlug = assignment.part.piece.slug;
      if (!(pieceSlug in pieces)) {
        pieces[pieceSlug] = {
          ...assignment.part.piece,
          activities: {},
        };
      }
      const act_type = assignment.activity.activity_type;
      pieces[pieceSlug].activities[`${act_type.category}-${act_type.name}`] =
        act_type;
    });
    return pieces;
  };
}

export function mutateAssignPiece(slug) {
  return (piece) =>
    getSession().then((session) => {
      const token = session.djangoToken;
      // console.log('assignpiece now', token, slug, piece)
      return fetch(
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
        .then((response) => response.json());
    });
}
export function mutateUnassignPiece(slug) {
  return (piece) =>
    getSession().then((session) => {
      const token = session.djangoToken;
      // console.log('unassignpiece now', token, slug, piece)
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
      // console.log('fetch submissions: slug, piece, partType: ', slug, piece, partType)
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
        .then((data) => {
          console.log('gotRecentSubmissions', data);
          return data;
        });
    });
  // const p = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     console.log('received gradable submissions for slug, piece, actCategory, partType', slug, piece, actCategory, partType)
  //     resolve([
  //       {
  //         id: 1,
  //         submitted: '2022-02-01 23:35:59.088114-05',
  //         content: 'hello'
  //       },
  //       {
  //         id: 2,
  //         submitted: '2022-02-04 23:35:59.088114-05',
  //         content: 'there'
  //       }
  //     ])
  //   }, 2000)
  // })
  // return p
  // })
}

export function mutateGradeSubmission(slug) {
  return ({ student_submission, rhythm, tone, expression, grader }) =>
    getSession().then((session) => {
      const token = session.djangoToken;
      // console.log('grade submission now', token, slug, submission,
      //   rhythm,
      //   tone,
      //   expression,
      //   grader)
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
  // console.log('mutateCreateSubmission, slug, assignmentid', slug, assignmentId)
  return (submission, assignmentId) =>
    getSession()
      .then((session) => {
        const token = session.djangoToken;
        // console.log('mutateCreateSubmission, session, submission', session, submission)
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
  console.log('getMySubmissionsForAssignment', assignmentId);
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
    .then((resultsJson) => {
      console.log(
        'end: getMySubmissionsForAssignment',
        resultsJson,
        resultsJson.length
      );
      return resultsJson;
    });
}

export function mutateCourse(slug) {
  // expecting params to be any subset of name, start_date, end_date, slug
  return (params) => {
    console.log('params', params);
    return getSession().then((session) => {
      console.log('session', session);
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
