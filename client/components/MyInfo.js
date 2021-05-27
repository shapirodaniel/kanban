import React from 'react'
import {TabbedNavigation} from './'
import {myInfoTabs} from './tabbed-navigation'

// HOC pattern
// to use TabbedNavigation, pass a tabs prop
// and add a "componentNameTabs.js" array to tabbed-navigation subdirectory
const MyInfo = () => <TabbedNavigation tabs={myInfoTabs} />

export default MyInfo
