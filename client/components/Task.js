import React from 'react'
import styled from 'styled-components'
import {Draggable} from 'react-beautiful-dnd'
import TaskContent from './TaskContent'

import {useSelector, useDispatch} from 'react-redux'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props =>
    props.isDragDisabled
      ? 'lightgrey'
      : props.isDragging
      ? 'lightgreen'
      : 'white'};
`

// we can specify a smaller drag handle target inside our draggable component
// by assigning it ...provided.dragHandleProps

/* const Handle = styled.div`
	width: 20px;
	height: 20px;
	background-color: orange;
	border-radius: 4px;
	margin-right: 8px;
`; */

const Task = ({taskId, index}) => {
  // for example
  // disable drag on a task by id
  const isDragDisabled = taskId === 'myTaskId'

  const task = useSelector(state =>
    state.project.columns
      .map(col => col.tasks)
      .flat()
      .find(t => t.id === taskId)
  )

  return (
    <Draggable
      draggableId={String(task.id)}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          // if we want to create a drag handle on our tasks
          // we should uncomment the Handle component above
          // and assign it ...provided.dragHandleProps
          // (commented out below)
          {...provided.dragHandleProps}
          isDragDisabled={isDragDisabled}
        >
          {/* <Handle {...provided.dragHandleProps} /> */}

          <TaskContent content={{...task}} />
        </Container>
      )}
    </Draggable>
  )
}

export default Task
