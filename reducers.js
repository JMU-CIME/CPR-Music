import { combineReducers } from 'redux';
import * as types from './types';

const mockAssignments = {
  loaded: false,
  items: [],
};

const assignmentsReducer = (state = mockAssignments, { type, payload }) => {
  switch (type) {
    case types.Action.GotAssignments:
      // console.log('got assignments', payload);
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

const assignedPiecesReducer = (
  state = initialAssignedPieces,
  { type, payload }
) => {
  switch (type) {
    case types.Action.GotActivities:
      let pieces = payload.activities.map(
        (assignment) => ({id: assignment.piece_id,
           name: assignment.piece_name})
      );
      pieces.sort((a, b) => (a.id < b.id ? -1 : 1));
      pieces = pieces.filter((piece, i, arr) =>
        i === 0 ? true : piece.id !== arr[i - 1].id
      );
      pieces.sort((a, b) => (a.name < b.name ? -1 : 1));

      // return { loaded: true, items: pieces };
      return { ...state, items: { ...state.items, [payload.slug]: pieces } };

    case types.Action.AssignedPiece:
      // console.log('AssignedPiece', payload)
      return {
        ...state,
        items: {
          ...state.items,
          [payload.slug]: [...state.items[payload.slug], payload.piece],
        },
      };

    case types.Action.UnassignedPiece:
      // console.log('UnassignedPiece', payload)
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
      // console.log('got activities', payload); // TODO: this reducer doesn't map
      return { loaded: true, items: { [payload.slug]: payload.activities } };
  }
  return state;
};

const initialPieces = { loaded: false, items: [] };

const piecesReducer = (state = initialPieces, { type, payload }) => {
  switch (type) {
    case types.Action.GotPieces:
      // console.log('got pieces', payload);
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
      // console.log('GotEnrollments', payload);
      return { loaded: true, items: payload, shouldInstrument: false };
    case types.Action.DidInstrument:
      console.log('updating shouldInstrument');
      return { ...state, shouldInstrument: false };
  }
  return state;
};

const mockRoster = { loaded: false, items: [] };

const rosterReducer = (state = mockRoster, { type, payload }) => {
  switch (type) {
    case types.Action.GotRoster:
      // console.log('GotRoster', payload);
      const items = {};
      payload.enrollments.forEach((item) => {
        items[item.id] = {
          ...item,
          activityState: types.ActivityState.Inactive,
        };
      });
      return { loaded: true, items, courseSlug: payload.courseSlug };
    case types.Action.UpdatedEnrollmentInstrument:
      // console.log('UpdatedEnrollmentInstrument', payload);
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
      // console.log('SetInstrumentActive', payload);
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
      // console.log('have user in reducer', payload);
      return {
        ...state,
        loaded: true,
        username: payload.user.name,
        token: payload.token,
      };
    case types.Action.GotProfile:
      // console.log('types.Action.GotProfile', payload);
      return {
        ...state,
        ...payload,
      };
    case types.Action.LoggedOut:
      // console.log('LoggedOut', payload);
      return { loaded: false };
  }
  return state;
};

const mockInstruments = { loaded: false, items: [] };

const instrumentsReducer = (state = mockInstruments, { type, payload }) => {
  switch (type) {
    case types.Action.GotInstruments:
      // console.log('GotInstruments', payload);
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
      // console.log('SelectedEnrollment payload', payload);
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
      console.log('SelectedAssignment payload', payload);
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
      // console.log("state", state);
      // console.log("payload", payload);
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
