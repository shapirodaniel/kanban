import React from 'react'
import {useLocation, useParams, Switch, Route, Link} from 'react-router-dom'
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

const Tab = ({tab}) => <div style={{margin: '0 1em'}}>hi im {tab.name}</div>

const MyInfo = () => {
  const {pathname} = useLocation()
  const {userId} = useParams()

  console.log(location, userId)

  return (
    <Container>
      <NavTabs>
        {tabs.map(tab => (
          <Link key={tab.id} to={`/users/${userId + tab.link}`}>
            <Tab tab={tab} />
          </Link>
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
