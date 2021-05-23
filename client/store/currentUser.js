import axios from 'axios'
import history from '../history'

const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

const getUser = user => ({type: GET_USER, payload: user})
const removeUser = () => ({type: REMOVE_USER})

export const me = () => async dispatch => {
  try {
    const {data: user} = await axios.get('/auth/me')
    dispatch(getUser(user || {}))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

const initState = {}

export default (state = initState, {type, payload}) => {
  switch (type) {
    case GET_USER:
      return payload
    case REMOVE_USER:
      return {}
    default:
      return state
  }
}
