import { combineReducers } from "redux";
import * as types from "./types";

// COUNTER REDUCER
const counterReducer = (state = 0, { type }) => {
  switch (type) {
    case types.INCREMENT:
      return state + 1;
    case types.DECREMENT:
      return state - 1;
    case types.RESET:
      return 0;
    default:
      return state;
  }
};

// INITIAL TIMER STATE
const initialTimerState = {
  lastUpdate: 0,
  light: false,
};

// TIMER REDUCER
const timerReducer = (state = initialTimerState, { type, payload }) => {
  switch (type) {
    case types.TICK:
      return {
        lastUpdate: payload.ts,
        light: !!payload.light,
      };
    default:
      return state;
  }
};

const initialCourses = [
  {
    id: 1,
    name: "This Old Band",
    level: "primary",
  },
  {
    id: 2,
    name: "It played Air...",
    level: "secondary",
  },
];

const coursesReducer = (state = initialCourses, { type, payload }) => {
  return state;
};

const loginStatus = {
  isStudent: false,
  isTeacher: false,
  isLoggedOut: true,
};

const loginReducer = (state = loginStatus, { type, payload }) => {
  switch (type) {
    case types.REMEMBER_LOGIN:
      return payload;
  }
  return state;
};

const initialPieces = [
  {
    id: 1,
    slug: "celebration-for-a-new-day",
    name: "Celebration for a New Day",
  },
  {
    id: 2,
    slug: "air-for-band",
    name: "Air for Band",
  },
  {
    id: 3,
    slug: "america-the-beautiful",
    name: "America the Beautiful",
  },
  {
    id: 4,
    slug: "chant",
    name: "Chant",
  },
  {
    id: 5,
    slug: "danny-boy",
    name: "Danny Boy",
  },
  {
    id: 6,
    slug: "jubilo",
    name: "Jubilo",
  },
  {
    id: 7,
    slug: "portamento",
    name: "Portamento",
  },
];

const piecesReducer = (state = initialPieces, { type, payload }) => {
  return state;
};

const initialActivityTypes = [
  {
    id: 1,
    name: 'Melody'
  },
  {
    id: 1,
    name: 'Bass Line'
  },
  {
    id: 1,
    name: 'Creativity'
  },
  {
    id: 1,
    name: 'Reflection'
  },
]

const activityTypesReducer = (state=initialActivityTypes, { type, payload }) => {
  return state;
};

// stubbing out pages
// ✅ Login user 
// ✅ Logout user
// ✅ Teacher creates course
// ✅ Teacher uploads csv to bulk create students for given course (just an option on the add/edit course)
// ✅ Teacher List all “pieces”
// ✅ Teacher list all Activities for a piece
// ✅ Teacher un/assign piece to course
// ✅ Teacher view submissions (incl non-submissions?) for an activity
// ✅ Teacher grade/mark submission
// ✅ Teacher export grades for all students in a course for all assignments in that course
// ✅ Student list all pieces assigned to their course
// ✅ Student list all activities for a piece (assigned in their course)
// ✅ Student view/show activity
// ✅ Student submit assignment (create submission?)
// ✅ Student re-submit assignment (just create another submission? Edit existing?)

const userReducer = (state={}, {type, payload}) => {
  switch(type) {
    case types.LOGGED_IN:
      console.log(types.LOGGED_IN, payload)
  }
  return state
}

// COMBINED REDUCERS
const reducers = {
  counter: counterReducer,
  timer: timerReducer,
  courses: coursesReducer,
  loginStatus: loginReducer,
  pieces: piecesReducer,
  activityTypes: activityTypesReducer,
  user: userReducer,
};

export default combineReducers(reducers);
