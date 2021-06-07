import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogIn } from '../../actions/userActions'

const Login = ({ history, loginToRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { loading, error } = useSelector(state => state.userLogIn)

  const dispatch = useDispatch()

  const loginHandler = e => {
    e.preventDefault()
    dispatch(userLogIn(email, password))
    history.push('/dashboard')
  }

  useEffect(() => {
    $('.ui.form').form({
      fields: {
        email: {
          identifier: 'email',
          rules: [
            {
              type: 'email',
              prompt: 'Please enter a valid email id',
            },
          ],
        },
        password: {
          identifier: 'password',
          rules: [
            {
              type: 'minLength[6]',
              prompt: 'Your password must be at least {ruleValue} characters',
            },
          ],
        },
      },
    })
  }, [])

  return (
    <div className="login-view">
      <h1 className="ui red image header">
        <img
          src="logo.svg"
          alt="logo"
          className="image"
          style={{ height: '8rem', width: 'auto' }}
        />
        <div className="content">Login to your Chat App</div>
      </h1>
      <div className="ui segment">
        <form className="ui form" onSubmit={loginHandler}>
          <div className="field">
            <div className="ui left icon input">
              <i className="red envelope icon" style={{ opacity: '1' }} />
              <input
                type="text"
                name="email"
                placeholder="Email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="ui left icon input">
              <i className="lock icon red" style={{ opacity: '1' }} />
              <input
                type="password"
                name="password"
                placeholder="Password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <button className="ui large fluid red loading button" type="submit">
              Log In
            </button>
          ) : (
            <button className="ui large fluid red button" type="submit">
              Login In
            </button>
          )}
          <div className="ui error message" />
          {error && (
            <div className="ui negative message">
              <i className="close icon"></i>
              <div className="header">{error}</div>
            </div>
          )}
        </form>
      </div>
      <div className="ui icon floating message">
        <i
          className="small red question circle outline icon"
          style={{ opacity: '1' }}
        />
        <div>
          <h3>
            New user?{' '}
            <b
              onClick={loginToRegister}
              style={{ color: '#db2828', cursor: 'pointer' }}
            >
              {' '}
              Sign up
            </b>{' '}
            now!
          </h3>
        </div>
      </div>
    </div>
  )
}
export default Login
