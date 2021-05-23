import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Column from './Column'
import {initialData} from './initialData'

import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchCurrentProject} from '../store'

const Container = styled.div`
  display: flex;
  overflow-x: scroll;
`

const Main = () => {
  // redux setup
  const {projectId} = useParams()
  const dispatch = useDispatch()
  const project = useSelector(state => state.project)

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      dispatch(fetchCurrentProject(projectId))
    }
    return () => {
      isMounted = false
    }
  }, [])

  // we can fetch the project :)
  console.log(project)

  const [state, setState] = useState({...initialData, homeIndex: null})

  const onDragStart = start => {
    const homeIndex = state.columnOrder.indexOf(start.source.droppableId)

    setState({...state, homeIndex})
  }

  /*

		onDragEnd receives a result object

		result: {
			draggableId: 'task-1',
			type: 'TYPE',
			reason: 'DROP' | 'CANCEL',
			source: {
				droppableId: 'column-1',
				index: 0,
			},
			destination: {
				droppableId: 'column-1',
				index: 1,
			}

			// destination can be null if user aborted drop with ESC or dropped outside droppable area
		}

	*/

  const onDragEnd = result => {
    // clear homeIndex when drag finishes
    setState({...state, homeIndex: null})

    // type will tell us if user dragged a column or a task
    const {destination, source, draggableId, type} = result

    // if dropped outside droppable target
    if (!destination) return

    // if dropped in same place that drag started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    // for column reordering
    if (type === 'column') {
      const newColumnOrder = [...state.columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...state,
        columnOrder: newColumnOrder
      }

      return setState(newState)
    }

    // otherwise, define start and end cols for task reordering
    const startCol = state.columns[source.droppableId]
    const finishCol = state.columns[destination.droppableId]

    // if dropped in same column
    if (startCol.id === finishCol.id) {
      const newTaskIds = [...startCol.taskIds]

      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startCol,
        taskIds: newTaskIds
      }

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn
        }
      }

      return setState(newState)
      // send update info to db
      // send socket updates to room
    }

    // otherwise, dropped in a different column
    const startTaskIds = [...startCol.taskIds]
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...startCol,
      taskIds: startTaskIds
    }

    const finishTaskIds = [...finishCol.taskIds]
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finishCol,
      taskIds: finishTaskIds
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    setState(newState)
    // send update info to db
    // send socket updates to room
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {/* set a different TYPE prop for our column droppable than our
			task droppable so they don't interfere with one another! */}
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {provided => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {state.columnOrder.map((columnId, index) => {
              const column = state.columns[columnId]
              const tasks = column.taskIds.map(taskId => state.tasks[taskId])

              // for example
              // this prevents moving tasks left
              // const isDropDisabled = index < state.homeIndex;

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  // isDropDisabled={isDropDisabled}
                  index={index}
                />
              )
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Main
