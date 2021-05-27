/* eslint-disable react/display-name */
import React from 'react'
import {OrgProjects, OrgMembers, OrgSettings} from '../'

export default [
  {
    id: 1,
    name: 'Projects',
    link: '/projects',
    // render function supplies render prop on Route
    render: () => <OrgProjects />
  },
  {
    id: 2,
    name: 'Members',
    link: '/members',
    render: () => <OrgMembers />
  },
  {id: 3, name: 'Settings', link: '/settings', render: () => <OrgSettings />}
]
