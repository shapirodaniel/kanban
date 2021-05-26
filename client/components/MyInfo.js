import React from 'react'
import {useParams, Switch, Route, NavLink} from 'react-router-dom'
import styled from 'styled-components'

const tabs = [
  {id: 1, name: 'Organizations', link: '/organizations'},
  {id: 2, name: 'Invitations', link: '/invitations'},
  {id: 3, name: 'Profile', link: '/profile'}
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

const Tab = ({tab}) => <div>{tab.name}</div>

const MyInfo = () => {
  const {userId} = useParams()

  return (
    <Container>
      <NavTabs>
        {tabs.map(tab => (
          <StyledNavLink key={tab.id} to={`/users/${userId + tab.link}`}>
            <Tab tab={tab} />
          </StyledNavLink>
        ))}
      </NavTabs>
      <Switch>
        {tabs.map(tab => (
          <Route
            key={tab.id}
            path={`/users/${userId + tab.link}`}
            render={() => <div>component: {tab.name}</div>}
          />
        ))}
      </Switch>
    </Container>
  )
}

export default MyInfo
