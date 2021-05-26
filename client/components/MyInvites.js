import React from 'react'
import {useLocation} from 'react-router-dom'

const MyInvites = () => {
  const {pathname} = useLocation()

  return <div>rendering at {pathname}</div>
}

export default MyInvites
