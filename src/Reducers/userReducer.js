import {
  USER_LOG_IN_REQUEST,
  USER_LOG_IN_SUCCESS,
  USER_LOG_IN_FAIL,
  USER_SIGN_OUT,
} from '../constants/userConstants'

export const userLogInReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOG_IN_REQUEST:
      return { loading: true, user: {} }
    case USER_LOG_IN_SUCCESS:
      return { loading: false, success: true, user: action.payload }
    case USER_LOG_IN_FAIL:
      return { loading: false, success: false, error: action.payload }
    case USER_SIGN_OUT:
      return state
    default:
      return state
  }
}
