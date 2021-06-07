import {
  GET_CHANNEL_INFO_FAIL,
  GET_CHANNEL_INFO_REQUEST,
  GET_CHANNEL_INFO_SUCCESS,
  GET_CHANNEL_LIST_FAIL,
  GET_CHANNEL_LIST_REQUEST,
  GET_CHANNEL_LIST_SUCCESS,
  GET_PRIVATE_CHANNEL_LIST_FAIL,
  GET_PRIVATE_CHANNEL_LIST_REQUEST,
  GET_PRIVATE_CHANNEL_LIST_SUCCESS,
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SET_ACTIVE_CHANNEL,
  SET_PROGRESS,
} from '../constants/messageConstants'

export const channelListReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CHANNEL_LIST_REQUEST:
      return { loading: true, channels: [] }
    case GET_CHANNEL_LIST_SUCCESS:
      return { loading: false, success: true, channels: action.payload }
    case GET_CHANNEL_LIST_FAIL:
      return { loading: false, success: false, error: action.payload }
    default:
      return state
  }
}

export const channelInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHANNEL:
      return {
        activeChannel: action.payload.cid,
        channelType: action.payload.type,
      }
    default:
      return state
  }
}

export const sentMessageReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_MESSAGE_REQUEST:
      return { loading: true }
    case SEND_MESSAGE_SUCCESS:
      return { loading: false, success: true }
    case SEND_MESSAGE_FAIL:
      return { loading: false, success: false, error: action.payload }
    default:
      return state
  }
}

export const privateChannelListReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PRIVATE_CHANNEL_LIST_REQUEST:
      return { loading: true, privateChannels: [] }
    case GET_PRIVATE_CHANNEL_LIST_SUCCESS:
      return { loading: false, success: true, privateChannels: action.payload }
    case GET_PRIVATE_CHANNEL_LIST_FAIL:
      return { loading: false, success: false, error: action.payload }
    default:
      return state
  }
}
