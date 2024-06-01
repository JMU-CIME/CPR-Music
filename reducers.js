import { combineReducers } from 'redux';
import * as types from './types';

const mockAssignments = {
  loaded: false,
  items: [],
};

const assignmentsReducer = (state = mockAssignments, { type, payload }) => {
  switch (type) {
    case types.Action.GotAssignments:
      return {
        loaded: true,
        items: payload,
      };
  }
  return state;
};

const initialAssignedPieces = {
  loaded: false,
  items: {},
};

// TODO what is this reducer for? it looks like it's to handle when the teacher
// assigns pieces, but it seems to also happen when the student needs to see
// their list of activities for a single piece?
// maybe any time either of the following bits of state are used from redux?
// activities
// assignedPieces
const assignedPiecesReducer = (
  state = initialAssignedPieces,
  { type, payload }
) => {
  switch (type) {
    case types.Action.GotActivities:
      // we have to make some changes here. the response is now already grouped.
      // the response will be an object with each key being a piece slug whose
      // value is an array of activities
      const pieceSlugsKeys = Object.keys(payload.activities)
      let pieces = pieceSlugsKeys.map((k) => {
        return {
          id: payload.activities[k][0].piece_id,
          slug: k,
          name: payload.activities[k][0].piece_name,
        }
      })
      // payload.activities.map(
      //   (assignment) => ({
      //     id: assignment.piece_id,
      //     name: assignment.piece_name
      //   })
      // );
      pieces.sort((a, b) => (a.id < b.id ? -1 : 1)); // FIXME how should the pieces be sorted? this assumes by the piece's id, but perhaps it should be by the order property of the piece_plan if it's available?

      // what does this next step do??
      // it looks like it says to only keep the first piece with a given id // thanks copilot for finishing my sentence 
      pieces = pieces.filter((piece, i, arr) =>
        i === 0 ? true : piece.id !== arr[i - 1].id
      );

      // FIXME again, as above, how do we want pieces sorted?
      pieces.sort((a, b) => (a.name < b.name ? -1 : 1));

      // return { loaded: true, items: pieces };
      return { ...state, items: { ...state.items, [payload.slug]: pieces } };

    case types.Action.AssignedPiece:
      return {
        ...state,
        items: {
          ...state.items,
          [payload.slug]: [...state.items[payload.slug], payload.piece],
        },
      };

    case types.Action.UnassignedPiece:
      return {
        ...state,
        items: {
          ...state.items,
          [payload.slug]: [
            ...state.items[payload.slug].filter(
              (pieceObj) => pieceObj.id !== payload.piece.id
            ),
          ],
        },
      };
  }
  return state;
};

const initialActivities = {
  loaded: false,
  items: [],
};

const activitiesReducer = (state = initialActivities, { type, payload }) => {
  switch (type) {
    case types.Action.GotActivities:
      console.log('payload', payload)
      return { loaded: true, items: payload.activities };
  }
  return state;
};

const initialPieces = { loaded: false, items: [] };

const piecesReducer = (state = initialPieces, { type, payload }) => {
  switch (type) {
    case types.Action.GotPieces:
      return { loaded: true, items: payload };
  }
  return state;
};

const mockEnrollments = { loaded: false, items: [] };

const enrollmentsReducer = (state = mockEnrollments, { type, payload }) => {
  switch (type) {
    case types.Action.AddedRoster:
      return { ...state, shouldInstrument: true };
    case types.Action.GotEnrollments:
      return { loaded: true, items: payload, shouldInstrument: false };
    case types.Action.DidInstrument:
      return { ...state, shouldInstrument: false };
  }
  return state;
};

const mockRoster = { loaded: false, items: [] };

const rosterReducer = (state = mockRoster, { type, payload }) => {
  switch (type) {
    case types.Action.GotRoster:
      const items = {};
      payload.enrollments.forEach((item) => {
        items[item.id] = {
          ...item,
          activityState: types.ActivityState.Inactive,
        };
      });
      return { loaded: true, items, courseSlug: payload.courseSlug };
    case types.Action.UpdatedEnrollmentInstrument:
      return {
        ...state,
        items: {
          ...state.items,
          [payload.enrollment.id]: {
            ...state.items[payload.enrollment.id],
            instrument: payload.instrument,
            activityState: types.ActivityState.Success,
          },
        },
      };
    case types.Action.SetInstrumentActive:
      return {
        ...state,
        items: {
          ...state.items,
          [payload.enrollmentId]: {
            ...state.items[payload.enrollmentId],
            activityState: payload.activityState,
          },
        },
      };
  }
  return state;
};

const initialCurrentUser = { loaded: false };

const currentUserReducer = (state = initialCurrentUser, { type, payload }) => {
  switch (type) {
    case types.Action.HaveUser:
      return {
        ...state,
        loaded: true,
        username: payload.user.name,
        token: payload.token,
      };
    case types.Action.GotProfile:
      return {
        ...state,
        ...payload,
      };
    case types.Action.LoggedOut:
      return { loaded: false };
  }
  return state;
};

const mockInstruments = { loaded: false, items: [] };

const instrumentsReducer = (state = mockInstruments, { type, payload }) => {
  switch (type) {
    case types.Action.GotInstruments:
      const items = {};
      payload.forEach((instrument) => {
        items[instrument.id] = instrument;
      });
      return { loaded: true, items };
  }
  return state;
};

const selectedEnrollmentReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case types.Action.SelectedEnrollment:
      if (payload) {
        return payload;
      }
  }
  return state;
};

const selectedAssignmentReducer = (
  state = { uploadStatus: types.UploadStatusEnum.Inactive },
  { type, payload }
) => {
  switch (type) {
    case types.Action.SelectedAssignment:
      return payload;
    // case types.Action.BeginUpload:
    //   return { ...state, uploadStatus: types.UploadStatusEnum.Active };
    // case types.Action.UploadSucceeded:
    //   return { ...state, uploadStatus: types.UploadStatusEnum.Success };
    // case types.Action.UploadFailed:
    //   return { ...state, uploadStatus: types.UploadStatusEnum.Erroneous };
  }
  return state;
};

const submitStatusReducer = (
  state = { submissions: {} },
  { type, payload }
) => {
  switch (type) {
    case types.Action.BeginUpload:
      return {
        ...state,
        submissions: {
          ...state.submissions,
          [payload.id]: types.UploadStatusEnum.Active,
        },
      };
    case types.Action.UploadSucceeded:
      return {
        ...state,
        submissions: {
          ...state.submissions,
          [payload.id]: types.UploadStatusEnum.Success,
        },
      };
    case types.Action.UploadFailed:
      return {
        ...state,
        submissions: {
          ...state.submissions,
          [payload.id]: types.UploadStatusEnum.Erroneous,
        },
      };
    case types.Action.UploadFinished:
      return {
        ...state,
        submissions: {
          // ...Object.keys(state.submissions).filter((elem) => elem !== payload.id).reduce( (res, key) => (res[key] = state.submissions[key], res), {} )
          ...Object.fromEntries(
            Object.entries(state.submissions).filter(
              (elem) => elem !== payload.id
            )
          ),
        },
      };
  }
  return state;
};

// COMBINED REDUCERS
const reducers = {
  assignments: assignmentsReducer,
  activities: activitiesReducer,
  assignedPieces: assignedPiecesReducer,
  pieces: piecesReducer,
  enrollments: enrollmentsReducer,
  instruments: instrumentsReducer,
  roster: rosterReducer,
  currentUser: currentUserReducer,
  selectedEnrollment: selectedEnrollmentReducer,
  selectedAssignment: selectedAssignmentReducer,
  submission: submitStatusReducer,
};

export default combineReducers(reducers);
