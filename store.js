import { useMemo } from 'react';
import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

import { createWrapper } from 'next-redux-wrapper';

// create a makeStore function
const makeStore = (context) => {
  return createStore(reducers, applyMiddleware(thunkMiddleware));
};

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true });
