import React from 'react'
import styled from 'styled-components'
import Task from './Task'
import {Droppable, Draggable} from 'react-beautiful-dnd'

import {useSelector, useDispatch} from 'react-redux'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    min-width: calc(100vw - 1em);
  }
`

const Title = styled.h3`
  padding: 8px;
`

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'lightblue' : 'inherit'};
  flex-grow: 1;
  min-height: 100px;
`

const Column = ({columnId, index /* isDropDisabled */}) => {
  const column = useSelector(state =>
    state.project.columns.find(col => col.id === columnId)
  )

  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {provided => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{column.name}</Title>
          {/* react-beautiful-dnd uses the render props pattern,
					so we have to invoke the child component wrapped by Droppable
					with an anonymous function */}
          <Droppable
            droppableId={String(column.id)}
            /* passed down from parent, where defined as any column left
						of the current column to force ONLY right movement of tasks! */
            // isDropDisabled={isDropDisabled}
            type="task"
          >
            {(provided, snapshot) => (
              /* styled components have a callback prop called innerRef
							that returns the DOM node of the component */
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {column.taskOrder.map((taskId, index) => {
                  return <Task key={taskId} taskId={taskId} index={index} />
                })}
                {/* placeholder is a react element used to increase available
								space of a droppable during drag as needed --
								must be added a child of the droppable component */}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  )
}

export default Column

// snapshot contains the following props

/*

const draggableSnapshot = {
	isDragging: true,
	draggingOver: 'droppableId',
}

const droppableSnapshot = {
	isDragging: true,
	draggingOverWith: 'draggableId',
}

*/

// we can use a styled-component's props
// to assign the snapshot.isDragging or snapshot.isDraggingOver
// and conditionally render styles based on drag state
