import axios from 'axios'
import socket from '../socket'

const GET_CURRENT_PROJECT = 'GET_CURRENT_PROJECT'
const UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT'
const REORDER_TASK = 'REORDER_TASK'

const getCurrentProject = project => ({
  type: GET_CURRENT_PROJECT,
  payload: project
})

export const updateCurrentProject = updateInfo => ({
  type: UPDATE_CURRENT_PROJECT,
  payload: updateInfo
})

const reorderTask = (
  sourceDroppableId,
  sourceTaskOrder,
  destDroppableId,
  destTaskOrder
) => ({
  type: REORDER_TASK,
  payload: {
    sourceDroppableId,
    sourceTaskOrder,
    destDroppableId,
    destTaskOrder
  }
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
      // to avoid render bug, dispatch local changes before PUT
      // retry if status not 200
      dispatch(updateCurrentProject(updateInfo))
      let status
      while (status !== 200) {
        const res = await axios.put(`/api/projects/${projectId}`, updateInfo)
        status = res.status
      }
      socket.emit(UPDATE_CURRENT_PROJECT, {type: 'project', id: projectId})
    } catch (err) {
      console.error(err)
    }
  }

export const fetchReorderTask =
  (
    draggableId,
    sourceDroppableId,
    sourceTaskOrder,
    destDroppableId,
    destTaskOrder,
    projectId
  ) =>
  async dispatch => {
    try {
      // same dispatch then PUT logic here
      dispatch(
        reorderTask(
          sourceDroppableId,
          sourceTaskOrder,
          destDroppableId,
          destTaskOrder
        )
      )
      let status
      while (status !== 200) {
        const res = await axios.put(`/api/tasks/reorder`, {
          draggableId,
          sourceDroppableId,
          sourceTaskOrder,
          destDroppableId,
          destTaskOrder
        })
        status = res.status
      }
      socket.emit(REORDER_TASK, {type: 'project', id: projectId})
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
    case REORDER_TASK: {
      const updatedColumns = state.columns.map(col => {
        if (col.droppableId === payload.sourceDroppableId) {
          col.taskOrder = payload.sourceTaskOrder
        }

        if (col.droppableId === payload.destDroppableId) {
          col.taskOrder = payload.destTaskOrder
        }

        return col
      })

      return {...state, columns: updatedColumns}
    }
    default:
      return state
  }
}
