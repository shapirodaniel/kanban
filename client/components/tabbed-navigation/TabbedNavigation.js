/* eslint-disable react/display-name */
import React from 'react'
import {useRouteMatch, Switch, Route, NavLink} from 'react-router-dom'
import styled from 'styled-components'

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

const TabbedNavigation = ({tabs}) => {
  // general purpose url for prefixing subroutes
  const {url} = useRouteMatch()

  return (
    <Container>
      <NavTabs>
        {tabs.map(tab => (
          <StyledNavLink key={tab.id} to={`${url + tab.link}`}>
            {tab.name}
          </StyledNavLink>
        ))}
      </NavTabs>
      <Switch>
        {tabs.map(tab => (
          <Route key={tab.id} path={`${url + tab.link}`} render={tab.render} />
        ))}
      </Switch>
    </Container>
  )
}

export default TabbedNavigation
