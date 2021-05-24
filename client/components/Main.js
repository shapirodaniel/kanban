/* eslint-disable complexity */
import React, {useEffect} from 'react'
import styled from 'styled-components'
import Column from './Column'

import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {
  fetchCurrentProject,
  fetchUpdateCurrentProject,
  fetchReorderTask
} from '../store'

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

  // we'll use this function to send socket messages and prevent drag on the same card simultaneously
  const onDragStart = start => {
    const {draggableId} = start
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
    // unpack result (see above)
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
      const newColumnOrder = [...project.columnOrder]

      // move uuid to new spot in orderArray
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      // PUT single project columnOrder
      dispatch(
        fetchUpdateCurrentProject(project.id, {
          columnOrder: newColumnOrder
        })
      )
    }

    // if dropped in same column
    if (source.droppableId === destination.droppableId) {
      let newTaskOrder = [
        ...project.columns.find(
          column => column.droppableId === destination.droppableId
        ).taskOrder
      ]

      newTaskOrder.splice(source.index, 1)
      newTaskOrder.splice(destination.index, 0, draggableId)

      return dispatch(
        fetchReorderTask(draggableId, source.droppableId, newTaskOrder)
      )
    }

    // finally, if we end up here, a task was dragged between columns
    // first, update the startCol taskOrderArray by filtering out the relocated task by its draggableId

    // first we'll say hi
    console.log('task moved between columns!')

    let sourceTaskOrder = [
      ...project.columns.find(
        column => column.droppableId === source.droppableId
      ).taskOrder
    ].filter(taskDraggableId => taskDraggableId !== draggableId)

    // then, update the destination column and splice in the new task's draggableId
    let destTaskOrder = [
      ...project.columns.find(
        column => column.droppableId === destination.droppableId
      ).taskOrder
    ]
    destTaskOrder.splice(destination.index, 0, draggableId)

    return dispatch(
      fetchReorderTask(
        draggableId,
        source.droppableId,
        sourceTaskOrder,
        destination.droppableId,
        destTaskOrder
      )
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
              project.columnOrder.map((columnUUID, index) => {
                /*
                  // for example, this prevents moving tasks left
                  const isDropDisabled = index < state.homeIndex;
                */

                return (
                  <Column
                    key={columnUUID}
                    columnUUID={columnUUID}
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
