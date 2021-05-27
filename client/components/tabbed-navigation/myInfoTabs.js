/* eslint-disable react/display-name */
import React from 'react'
import {MyOrgs, MyInvites, MyProfile} from '../'

export const myInfoTabs = [
  {
    id: 1,
    name: 'Organizations',
    link: '/organizations',
    // render function supplies render prop on Route
    render: () => <MyOrgs />
  },
  {
    id: 2,
    name: 'Invitations',
    link: '/invitations',
    render: () => <MyInvites />
  },
  {id: 3, name: 'Profile', link: '/profile', render: () => <MyProfile />}
]
