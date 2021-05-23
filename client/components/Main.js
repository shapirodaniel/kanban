/* eslint-disable complexity */
import React, {useEffect} from 'react'
import styled from 'styled-components'
import Column from './Column'

import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchCurrentProject, fetchUpdateCurrentProject} from '../store'

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

  const handleColumnDrag = (
    columnOrderArray,
    source,
    destination,
    draggableId
  ) => {
    console.log('column drag detected!')
    const newColumnOrder = [...columnOrderArray]
    newColumnOrder.splice(source.index, 1)
    // coerce draggableId back to num with unary operator
    newColumnOrder.splice(destination.index, 0, +draggableId)
    dispatch(
      fetchUpdateCurrentProject(project.id, {
        columnOrder: newColumnOrder
      })
    )
    return console.log('new column order is: ', newColumnOrder)
  }

  const handleTaskDrag = (taskOrderArray, source, destination, draggableId) => {
    const updatedTaskOrder = [...taskOrderArray]

    updatedTaskOrder.splice(source.index, 1)
    updatedTaskOrder.splice(destination.index, 0, +draggableId)

    return console.log('updatedTaskOrder is: ', updatedTaskOrder)
    // PUT Task.reorder
    // send update info to db
    // send socket updates to room
  }

  const onDragEnd = result => {
    const {destination, source, draggableId, type} = result

    // if dropped outside droppable target
    if (!destination) return console.log('no destination!')

    // if dropped in same place that drag started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return console.log('dropped in same place!')

    // for column reordering
    if (type === 'column') {
      handleColumnDrag(project.columnOrder, source, destination, draggableId)
      console.log(
        'droppable source/destination ids are: ',
        source.droppableId,
        destination.droppableId
      )
      return
    }

    // otherwise, define start and end cols for task reordering
    const startCol = project.columns[source.index]
    const finishCol = project.columns[destination.index]

    // if dropped in same column
    if (startCol.id === finishCol.id) {
      handleTaskDrag(startCol.taskOrder, source, destination, draggableId)
      return
    }

    // finally, if we end up here, a task was dragged between columns
    const updatedStartColTaskOrder = [...startCol.taskOrder]
    updatedStartColTaskOrder.splice(source.index, 1)

    const updatedFinishColTaskOrder = [...finishCol.taskOrder]
    // coerce draggableId to number here
    updatedFinishColTaskOrder.splice(destination.index, 0, +draggableId)

    return console.log(
      'updated start col task order is: ',
      updatedStartColTaskOrder,
      '\n',
      'updated finish col task order is: ',
      updatedFinishColTaskOrder
    )

    // PUT Task.reorder
    // send update info to db
    // send socket updates to room}
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
                /*
                  // for example, this prevents moving tasks left
                  const isDropDisabled = index < state.homeIndex;
                */

                return (
                  <Column
                    key={columnId}
                    columnId={columnId}
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
