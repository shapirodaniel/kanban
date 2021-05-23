import React from 'react'

const TaskContent = ({content}) => {
  const {name, openedBy, users} = content

  return (
    <div>
      <div>{name || ''}</div>
      <div>{openedBy || ''}</div>
      <ul>
        {users
          ? users.map((assignee, idx) => (
              <li key={idx} style={{display: 'flex', margin: '1em'}}>
                <img
                  style={{height: '24px', width: 'auto'}}
                  src={assignee.imageUrl}
                />
                <div>{assignee.firstName}</div>
              </li>
            ))
          : 'no-content'}
      </ul>
    </div>
  )
}

export default TaskContent
