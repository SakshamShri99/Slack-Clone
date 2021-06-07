import React, { useState } from 'react'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import firebase from '../firebase'

const Home = ({ history }) => {
  const [loading, setLoading] = useState(true)

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      history.push('/dashboard')
    } else setLoading(false)
  })

  const loginToRegister = e => {
    e.preventDefault()
    $('.login-view').transition({
      animation: 'horizontal flip',
      duration: '500ms',
    })
    setTimeout(() => {
      $('.register-view').transition({
        animation: 'horizontal flip',
      })
    }, 500)
  }

  const registerToLogin = e => {
    e.preventDefault()
    $('.register-view').transition({
      animation: 'horizontal flip',
      duration: '500ms',
    })
    setTimeout(() => {
      $('.login-view').transition({
        animation: 'horizontal flip',
      })
    }, 500)
  }

  return (
    <>
      {loading ? (
        <div className="ui active inverted dimmer">
          <div className="ui massive text loader">Loading</div>
        </div>
      ) : (
        <div
          className="ui middle aligned center aligned grid signup-card"
          style={{ height: '100%' }}
        >
          <div className="column four wide" style={{ minWidth: '380px' }}>
            <Login loginToRegister={loginToRegister} history={history} />
            <Register registerToLogin={registerToLogin} history={history} />
          </div>
        </div>
      )}
    </>
  )
}

export default Home
