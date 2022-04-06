import { getSession } from "next-auth/react";
// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
}
export function getEnrollments() {
  return getSession()
    .then((session) => {
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
    })
}
export function getAllPieces() {
  console.log('begin: getAllPieces')
  return getSession()
    .then((session) => {
      const token = session.djangoToken;
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/pieces/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(assertResponse)
        .then((response) => {
          console.log('end: getAllPieces')
          return response.json()
        })
      
    })
}
export function getAssignedPieces(slug) {
  console.log('begin: getAssignedPieces')
  return () => getSession()
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
      )
    })
    .then(assertResponse)
    .then((response) => {
      console.log('end: getAssignedPieces');
      return response.json();
    })
    .then((assignments) => {
      const pieces = {}
      assignments.forEach((assignment) => { 
        const pieceSlug = assignment.part.piece.slug
        if (!(pieceSlug in pieces)) {
          pieces[pieceSlug] = {
            ...assignment.part.piece,
            activities: {}
          }
        }
        const act_type = assignment.activity.activity_type
        pieces[pieceSlug].activities[`${act_type.category}-${act_type.name}`] = act_type;
      })
      return pieces;
    })
}

export function mutateAssignPiece(slug) {
  return (piece) => getSession()
    .then((session) =>  {
      const token = session.djangoToken;
      console.log('assignpiece now', token, slug, piece)
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
        .then((response) => response.json())
    })
}
export function mutateUnassignPiece(slug) {
  return (piece) => getSession()
    .then((session) =>  {
      const token = session.djangoToken;
      console.log('unassignpiece now', token, slug, piece)
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
      )
    })
}
export function getRecentSubmissions({ slug, piece, actCategory, partType }) {
  return ()=> getSession()
    .then((session) => {
      const token = session.djangoToken;
      //   return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/submissions/${actCategory}/${partType}`, {
      //     headers: {
      //       Authorization: `Token ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   })
      //     .then(assertResponse)
      //     .then((response) => response.json())
      // })
      const p = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('received gradable submissions for slug, piece, actCategory, partType', slug, piece, actCategory, partType)
          resolve([
            {
              id: 1,
              submitted: '2022-02-01 23:35:59.088114-05',
              content: 'hello'
            },
            {
              id: 2,
              submitted: '2022-02-04 23:35:59.088114-05',
              content: 'there'
            }
          ])
        }, 2000)
      })
      return p
    })
}