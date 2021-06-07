import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLogInReducer } from './Reducers/userReducer'
import {
  channelInfoReducer,
  channelListReducer,
  privateChannelListReducer,
  sentMessageReducer,
} from './Reducers/messageReducer'

const reducer = combineReducers({
  userLogIn: userLogInReducer,
  channelList: channelListReducer,
  channelInfo: channelInfoReducer,
  sentMessage: sentMessageReducer,
  privateChannelList: privateChannelListReducer,
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
