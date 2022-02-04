import { combineReducers } from 'redux';
import * as types from './types';

const mockAssignments = {
  loaded: false,
  items: [],
};

const assignmentsReducer = (state = mockAssignments, { type, payload }) => {
  switch (type) {
  case types.Action.GotAssignments:
    console.log('got assignments', payload);
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
      (assignment) => assignment.part.piece
    );
    pieces.sort((a, b) => (a.id < b.id ? -1 : 1));
    pieces = pieces.filter((piece, i, arr) =>
      i === 0 ? true : piece.id !== arr[i - 1].id
    );
    pieces.sort((a, b) => (a.name < b.name ? -1 : 1));

    // return { loaded: true, items: pieces };
    return { ...state, items: { ...state.items, [payload.slug]: pieces } };
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
    console.log('got activities', payload); // TODO: this reducer doesn't map
    return { loaded: true, items: {[payload.slug]: payload.activities} };
  }
  return state;
};

const initialPieces = { loaded: false, items: [] };

const piecesReducer = (state = initialPieces, { type, payload }) => {
  switch (type) {
  case types.Action.GotPieces:
    console.log('got pieces', payload);
    return { loaded: true, items: payload };
  }
  return state;
};

const mockEnrollments = { loaded: false, items: [] };

const enrollmentsReducer = (state = mockEnrollments, { type, payload }) => {
  switch (type) {
  case types.Action.AddedRoster:
    console.log('addedRoster', payload);
    return state;
  case types.Action.GotEnrollments:
    console.log('GotEnrollments', payload);
    return { loaded: true, items: payload };
  }
  return state;
};

const mockRoster = { loaded: false, items: [] };

const rosterReducer = (state = mockRoster, { type, payload }) => {
  switch (type) {
  case types.Action.GotRoster:
    console.log('GotRoster', payload);
    const items = {};
    payload.forEach((item) => {
      items[item.id] = item;
    });
    return { loaded: true, items };
  case types.Action.UpdatedEnrollmentInstrument:
    console.log('UpdatedEnrollmentInstrument', payload);
    return {
      ...state,
      items: {
        ...state.items,
        [payload.enrollment.id]: {
          ...state.items[payload.enrollment.id],
          instrument: payload.instrument,
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
    console.log('have user in reducer', payload);
    return {
      ...state,
      loaded: true,
      username: payload.user.name,
      token: payload.token,
    };
  case types.Action.GotProfile:
    console.log('types.Action.GotProfile', payload);
    return {
      ...state,
      ...payload,
    };
  case types.Action.LoggedOut:
    console.log('LoggedOut', payload);
    return { loaded: false };
  }
  return state;
};

const mockInstruments = { loaded: false, items: [] };

const instrumentsReducer = (state = mockInstruments, { type, payload }) => {
  switch (type) {
  case types.Action.GotInstruments:
    console.log('GotInstruments', payload);
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
    console.log('SelectedEnrollment payload', payload);
    if (payload) {
      return payload;
    }
  }
  return state;
};

const selectedAssignmentReducer = (state = {}, { type, payload }) => {
  switch (type) {
  case types.Action.SelectedAssignment:
    console.log('SelectedAssignment payload', payload);
    return payload;
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
};

export default combineReducers(reducers);
