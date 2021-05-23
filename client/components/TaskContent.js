import React from 'react'

const TaskContent = ({content}) => {
  const {name, openedBy, assignees} = content

  return (
    <div>
      <div>{name || ''}</div>
      <div>{openedBy || ''}</div>
      <ul>
        {assignees
          ? assignees.map((assignee, idx) => <li key={idx}>{assignee}</li>)
          : 'no-content'}
      </ul>
    </div>
  )
}

export default TaskContent
