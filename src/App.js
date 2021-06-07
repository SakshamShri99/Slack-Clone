import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dashboard from './screens/Dashboard'
import Home from './screens/Home'

function App() {
  return (
    <Router>
      <Route path="/" component={Home} exact />
      <Route path="/dashboard" component={Dashboard} exact />
    </Router>
  )
}

export default App
