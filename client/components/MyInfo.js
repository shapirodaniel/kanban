/* eslint-disable react/display-name */
import React from 'react'
import {useParams, Switch, Route, NavLink} from 'react-router-dom'
import styled from 'styled-components'
import {MyOrgs, MyInvites, MyProfile} from './'

const tabs = [
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

const Container = styled.div``

const NavTabs = styled.nav`
  display: flex;
`

// active class styling for NavLink applied by styled-components
const activeClassName = 'selected'
const StyledNavLink = styled(NavLink).attrs({activeClassName})`
  & {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
    min-width: 120px;
    margin: 0;
    border-bottom: 1px solid black;
    color: inherit;
  }
  &.${activeClassName} {
    color: blue;
    border: 1px solid black;
    border-bottom: none;
  }
`

const MyInfo = () => {
  const {userId} = useParams()

  return (
    <Container>
      <NavTabs>
        {tabs.map(tab => (
          <StyledNavLink key={tab.id} to={`/users/${userId + tab.link}`}>
            {tab.name}
          </StyledNavLink>
        ))}
      </NavTabs>
      <Switch>
        {tabs.map(tab => (
          <Route
            key={tab.id}
            path={`/users/${userId + tab.link}`}
            render={tab.render}
          />
        ))}
      </Switch>
    </Container>
  )
}

export default MyInfo
