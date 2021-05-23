import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import userReducer from './currentUser'
import projectReducer from './currentProject'

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)

const store = createStore(rootReducer, middleware)

export default store

// export * from each subreducer here to simplify imports
export * from './currentUser'
export * from './currentProject'
