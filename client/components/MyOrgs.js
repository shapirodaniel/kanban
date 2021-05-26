import React from 'react'
import {useLocation} from 'react-router-dom'

const MyOrgs = () => {
  const {pathname} = useLocation()

  return <div>rendering at {pathname}</div>
}

export default MyOrgs
