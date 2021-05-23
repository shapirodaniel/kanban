import React from 'react'

const TaskContent = ({content}) => (
  <div>
    <div>{content.name}</div>
    <ul>
      {content.assignees.map((assignee, idx) => (
        <li key={idx}>{assignee}</li>
      ))}
    </ul>
  </div>
)

export default TaskContent
