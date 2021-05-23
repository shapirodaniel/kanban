import axios from 'axios'

const GET_CURRENT_PROJECT = 'GET_CURRENT_PROJECT'
const UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT'

const getCurrentProject = project => ({
  type: GET_CURRENT_PROJECT,
  payload: project
})

export const updateCurrentProject = project => ({
  type: UPDATE_CURRENT_PROJECT,
  payload: project
})

export const fetchCurrentProject = projectId => async dispatch => {
  try {
    const {data: project} = await axios.get(`/api/projects/${projectId}`)
    dispatch(getCurrentProject(project))
  } catch (err) {
    console.error(err)
  }
}

const initState = {}

export default (state = initState, {type, payload}) => {
  switch (type) {
    case GET_CURRENT_PROJECT:
      return payload
    case UPDATE_CURRENT_PROJECT:
      return payload
    default:
      return state
  }
}
