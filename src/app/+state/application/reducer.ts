import * as ApplicationActions from './actions';
import { User } from '../../+models/user';

export interface State {
  isLoggedIn: boolean;
  currentUser: User;
}

const initialState: State = {
  isLoggedIn: true,
  currentUser: null,
};

export function reducer(state = initialState, action: ApplicationActions.All): State {
  switch (action.type) {
    case ApplicationActions.LOG_OUT: {
      return {
        ...state,
        isLoggedIn: false,
        currentUser: null,
      };
    }

    case ApplicationActions.LOG_IN: {
      return {
        ...state,
        isLoggedIn: true,
      };
    }

    default: {
      return state;
    }
  }
}
