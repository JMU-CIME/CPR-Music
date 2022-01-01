import * as types from "./types";

// https://allover.twodee.org/remote-state/fetching-memories/
function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

// INITIALIZES CLOCK ON SERVER
export const serverRenderClock = () => (dispatch) =>
  dispatch({
    type: types.TICK,
    payload: { light: false, ts: Date.now() },
  });

// INITIALIZES CLOCK ON CLIENT
export const startClock = () => (dispatch) =>
  setInterval(() => {
    dispatch({ type: types.TICK, payload: { light: true, ts: Date.now() } });
  }, 1000);

// INCREMENT COUNTER BY 1
export const incrementCount = () => ({ type: types.INCREMENT });

// DECREMENT COUNTER BY 1
export const decrementCount = () => ({ type: types.DECREMENT });

// RESET COUNTER
export const resetCount = () => ({ type: types.RESET });

export const rememberLogin = ({ isTeacher, isStudent, isLoggedOut }) => {
  return {
    type: types.REMEMBER_LOGIN,
    payload: { isTeacher, isStudent, isLoggedOut },
  };
};

export const loggedIn = (data) => ({ type: types.LOGGED_IN, payload: data });

export const attemptLogin = (loginInfo) => {
  let loginMessageBody = {};
  if (loginInfo && "email" in loginInfo && "password" in loginInfo) {
    loginMessageBody = {
      email: loginInfo.email,
      password: loginInfo.password,
    };
  } else if (loginInfo && "school_id" in loginInfo) {
    loginMessageBody = {
      school_id: loginInfo.school_id,
    };
  } else {
    console.error("not enough info to login", loginInfo);
  }

  return (dispatch) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginMessageBody),
    };
    fetch(`https://teleband.cs.jmu.edu/login`, options)
      .then(assertResponse)
      .then((response) => response.json())
      .then((data) => {
        console.log("got back response", data, data.token);
        if (data.error) {
          console.error(data);
        } else {
          dispatch(loggedIn(data));
        }
        // if (data.) {
        //   dispatch(replaceMemory({...memory, isEditing: false}));
        // } else {
        //   console.error(data);
        // }
      });
  };
};

// const onSubmitTeacher = (values) => {
//   loggingIn({ email: values["email"], password: values["password"] }, "teacher")
// }
// const onSubmitStudent = (values) => {
//   loggingIn({ school_id: values["school-id"] }, "student")
// }

// function loggingIn(payload, type) {
//   fetch(`${FetchURL}login`, {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//       },
//       body: JSON.stringify(payload)
//   })
//   .then(resp => resp.json())
//   .then(json => {
//       if (json.error) {
//           alert(json.message)
//       } else {
