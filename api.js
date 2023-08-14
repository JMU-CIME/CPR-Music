/* eslint-disable no-restricted-syntax */
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
    // console.log('getStudentAssignments');
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
        // console.log('results', results);
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
        // console.log('grouped', grouped);
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
    if (Object.values(assignments).length > 0) {
      for (const pieceKey of Object.keys(assignments)) {
        for (const pieceAssignment of assignments[pieceKey]) {
          //   pieces[pieceAssignment.part.piece.id] = pieceAssignment.part.piece;
          // }
          if (!(pieceKey in pieces)) {
            pieces[pieceKey] = {
              ...pieceAssignment.part.piece,
              activities: {},
            };
          }
          console.log('pieceAssignment', pieceAssignment);
          const actType = pieceAssignment.activity.activity_type;
          pieces[pieceKey].activities[`${actType.category}-${actType.name}`] =
            actType;
        }
      }
    }
    return pieces;
    // console.log('foreach', Object.values(assignments));
    // Object.values(assignments).forEach((assignment, i) => {
    //   const pieceSlug = assignment?.part?.piece?.slug;
    //   console.log('pieceslug', pieceSlug);
    //   if (pieceSlug === undefined) {
    //     console.log(assignments, assignment, i)
    //   }
    //   if (!(pieceSlug in pieces)) {
    //     pieces[pieceSlug] = {
    //       ...assignment.part.piece,
    //       activities: {},
    //     };
    //   }
    //   const act_type = assignment.activity.activity_type;
    //   pieces[pieceSlug].activities[`${act_type.category}-${act_type.name}`] =
    //     act_type;
    // });
    return pieces;
  };
  /**
   * {
    "air-for-band": {
      actvities: {
        "Perform-Melody":{
          category: "Perform",​​
          name: "Melody"
        }
      },
      accompaniment: "http://localhost:8000/media/accompaniments/Air_for_Band_Accompaniment.mp3",
      audio: ""​​​​.
      composer: Object { name: "Frank Erickson", url: "" }​​​​.
      date_composed: null​​​​.
      ensemble_type: 1​​​​.
      id: 1​​​​.
      name: "Air for Band"​​​​.
      slug: "air-for-band"​​​​.
      video: "".
    }
   */
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
  // console.log('getMySubmissionsForAssignment', assignmentId);
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
      // console.log(
      //   'end: getMySubmissionsForAssignment',
      //   resultsJson,
      //   resultsJson.length
      // );
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

// /api/courses/:slug/assignments/:id
export function getTelephoneGroup() {
  return getSession().then((session) => {
    if (!session || !session.djangoToken) {
      return {};
    }
    const token = session.djangoToken;
    return {
      // key will be the assignment.activity.activitytype.name
      'Melody': {
        // enrollment.instrument
        // enrollment.user.name
        // assn submission.content for score (create)
        // assn submission attachment (for recording)
        // order???
        instrument: {
          id: 1,
          name: 'Horn',
        },
        user: {
          name: 'michael',
        },
        content: `{"score-partwise":{"$version":"3.1","part-list":{"score-part":[{"part-name":"","voiceMapping":{"0":[0]},"staffMapping":[{"mainVoiceIdx":0,"voices":[0],"staffUuid":"27af7fc4-1006-28b9-c626-9d881b88eda1"}],"voiceIdxToUuidMapping":{"0":"50bece63-7116-ae47-d16b-e7167bfed51b"},"voiceUuidToIdxMapping":{"50bece63-7116-ae47-d16b-e7167bfed51b":0},"score-instrument":{"instrument-name":"Trumpet","$id":"P1-I1"},"midi-instrument":{"midi-program":57,"volume":"100","$id":"P1-I1","midi-channel":"1"},"$id":"P1","uuid":"36fa80d0-8b21-6cf1-ebcc-2907c7c4a158"}]},"measure-list":{"score-measure":[{"uuid":"f71c4b89-09c5-2b8f-588e-a6f9144bb452"},{"uuid":"842d5adf-72f1-382f-7fb8-d310f35cdcac"},{"uuid":"0af7aa3a-2537-f11d-3881-700faa4b5c24"},{"uuid":"240a8727-43be-b7c4-153c-2765f5109e6f"},{"uuid":"238e5799-6946-ee13-985a-cd91183a4e40"},{"uuid":"d545cac3-f9b4-a716-c778-b09831670459"},{"uuid":"9c607ce2-5d14-8313-44e9-587955a1c036"},{"uuid":"7a4e969c-421a-f9a3-f6f9-e0c8001fc06d"},{"uuid":"3863e92a-32d9-d949-813e-b601a80aafb9"},{"uuid":"dbe03ea7-ff25-1d3b-d1a3-4ca876f20b33"},{"uuid":"c345a858-0ef3-ece5-5e7d-95739c627de4"},{"uuid":"c3e10cc7-ea66-3f91-8c89-6b4ce9445d84"},{"uuid":"3b78bc4c-70fa-4d02-ef2b-1cdafdcca711"},{"uuid":"3b239744-bf4a-b046-e698-5f3804c49903"},{"uuid":"ddaf4c32-7a7a-33dc-9409-e19c05b3394b"},{"uuid":"6ec6a12a-2fa4-a3fb-4b70-4e5c18c63c98"}]},"part":[{"measure":[{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"1","attributes":[{"divisions":"1","time":{"beats":"4","beat-type":"4"},"clef":{"sign":"G","line":"2"},"key":{"fifths":"-2"},"transpose":{"chromatic":"-2","diatonic":"-1"},"staff-details":{"staff-lines":"5"},"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"sound":[{"$adagio-swing":{"swing":false},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}},{"$tempo":"80","noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"direction":[{"$placement":"above","staff":"1","$adagio-location":{"timePos":0},"direction-type":{"metronome":{"per-minute":"80","beat-unit":"quarter"}},"noteBefore":-1,"$adagio-isFirst":true}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"2","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"3","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"4","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"5","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"6","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"7","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"8","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"9","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"10","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"11","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"12","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"13","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"14","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"harmony":[],"$number":"15","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]},{"note":[{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":0}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":1}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":2}},{"rest":{},"voice":"1","staff":"1","duration":"1","type":"quarter","$adagio-location":{"timePos":3}}],"barline":{"$location":"right","bar-style":"light-heavy","$adagio-location":{"dpq":1,"timePos":4},"noteBefore":3},"harmony":[],"$number":"16","attributes":[{"$adagio-time":{"beats":"4","beat-type":"4"},"noteBefore":-1,"$adagio-location":{"timePos":0,"dpq":1}}],"$adagio-beatsList":[1,1,1,1]}],"$id":"P1","uuid":"36fa80d0-8b21-6cf1-ebcc-2907c7c4a158"}],"defaults":{"scaling":{"millimeters":"7","tenths":"40"},"page-layout":{"page-height":"1596.5714285714287","page-width":"1233.7142857142858","page-margins":{"$type":"both","top-margin":"38.857142857142854","bottom-margin":"38.857142857142854","left-margin":"38.857142857142854","right-margin":"38.857142857142854"}},"system-layout":{"system-distance":"115.2"},"staff-layout":{"staff-distance":"72.57142857142857"},"$adagio-measureNumberingStart":1,"word-font":{"$font-family":"Century Schoolbook L"},"$adagio-systemBreakPolicy":{"maxNbMeasuresPerLine":4,"forbiddenCounts":{}}},"$adagio-formatVersion":51,"credit":[{"credit-type":"title","credit-words":"Air For Band - Melody - Bb - Blank"}],"work":{"work-title":"Air For Band - Melody - Bb - Blank"},"identification":{"encoding":{"software":"Flat","encoding-date":"2022-10-11"},"source":"https://flat.io/score/62689806be1cd400126c158a-air-for-band-melody-bb-blank?sharingKey=fc580b58032c2e32d55543ad748043c3fd7f5cd90d764d3cbf01355c5d79a7acdd5c0944cd2127ef6f0b47138a074477c337da654712e73245ed674ffc944ad8"}}}`,
        audio: 'url',
      },
      "Bassline": {},
      "Creativity": {},
    };
    // return fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/courses/${slug}/assignments/${assnId}`,
    //   {
    //     headers: {
    //       Authorization: `Token ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // ).then((response, ...rest) => {
    //   const results = response.json();
    //   return results;
    // });
  });
}
