import axios from 'axios'

const GET_CURRENT_PROJECT = 'GET_CURRENT_PROJECT'
const UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT'

const getCurrentProject = project => ({
  type: GET_CURRENT_PROJECT,
  payload: project
})
export const updateCurrentProject = updateInfo => ({
  type: UPDATE_CURRENT_PROJECT,
  payload: updateInfo
})

export const fetchCurrentProject = projectId => async dispatch => {
  try {
    const {data: project} = await axios.get(`/api/projects/${projectId}`)
    dispatch(getCurrentProject(project))
  } catch (err) {
    console.error(err)
  }
}
export const fetchUpdateCurrentProject =
  (projectId, updateInfo) => async dispatch => {
    try {
      const {status} = await axios.put(`/api/projects/${projectId}`, updateInfo)

      if (status === 200) {
        dispatch(updateCurrentProject(updateInfo))
      }
    } catch (err) {
      console.error(err)
    }
  }

const initState = {}

export default (state = initState, {type, payload}) => {
  switch (type) {
    case GET_CURRENT_PROJECT:
      return {...state, ...payload}
    case UPDATE_CURRENT_PROJECT:
      return {...state, ...payload}
    default:
      return state
  }
}
