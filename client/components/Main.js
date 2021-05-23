import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Column from './Column'
import {initialData} from './initialData'

import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchCurrentProject, updateCurrentProject} from '../store'

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

  // we'll use this function to send socket messages and prevent drag on the same card simultaneously
  const onDragStart = start => {
    const {draggableId} = start
    console.log('draggableId is: ', draggableId)
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
      const newColumnOrder = [...project.columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...project,
        columnOrder: newColumnOrder
      }

      return updateCurrentProject(newState)
    }

    // otherwise, define start and end cols for task reordering
    const startCol = project.columns[source.droppableId]
    const finishCol = project.columns[destination.droppableId]

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
        ...project,
        columns: {
          ...project.columns,
          [newColumn.id]: newColumn
        }
      }

      return updateCurrentProject(newState)
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
      ...project,
      columns: {
        ...project.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    updateCurrentProject(newState)
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
            {project.columnOrder &&
              project.columnOrder.map((columnId, index) => {
                console.log(project.columnOrder)

                console.log(project.columns)

                // grab column by columnOrder id

                const column = project.columns.find(col => col.id === columnId)

                console.log(column)

                // grab column tasks and order by taskIds on column
                // important! ternary guarantees an array if taskOrder is NULL
                const tasks = column.taskOrder
                  ? column.taskOrder.map(taskId =>
                      column.tasks.find(task => task.id === taskId)
                    )
                  : []

                /*
                  // for example, this prevents moving tasks left
                  const isDropDisabled = index < state.homeIndex;
                */

                console.log(tasks)

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
