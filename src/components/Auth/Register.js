import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userSignUp } from '../../actions/userActions'

const Register = ({ history, registerToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cnfPassword, setCnfPassword] = useState('')

  const { loading, error } = useSelector(state => state.userLogIn)

  const dispatch = useDispatch()

  const registerHandler = e => {
    e.preventDefault()
    dispatch(userSignUp(name, email, password))
    history.push('/dashboard')
  }

  useEffect(() => {
    $('.register-view').transition('hide')
    $('.ui.form').form({
      fields: {
        name: {
          identifier: 'name',
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter your name',
            },
          ],
        },
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
        cnfPassword: {
          identifier: 'confirm-password',
          rules: [
            {
              type: 'match[password]',
              prompt: 'Passwords do not match',
            },
          ],
        },
      },
    })
  }, [])

  return (
    <div className="register-view">
      <h1 className="ui red image header">
        <img
          src="logo.svg"
          alt="logo"
          className="image"
          style={{ height: '8rem', width: 'auto' }}
        />
        <div className="content">Register for your Chat App</div>
      </h1>
      <div className="ui segment">
        <form className="ui form" onSubmit={registerHandler}>
          <div className="field">
            <div className="ui left icon input">
              <i className="red user icon" style={{ opacity: '1' }} />
              <input
                type="text"
                name="name"
                placeholder="Name..."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
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
          <div className="field">
            <div className="ui left icon input">
              <i className="redo alternate icon red" style={{ opacity: '1' }} />
              <input
                type="password"
                name="confirm-password"
                placeholder="Confirm Password..."
                value={cnfPassword}
                onChange={e => setCnfPassword(e.target.value)}
              />
            </div>
          </div>
          {true ? (
            <button className="ui large fluid red loading button" type="submit">
              Sign Up
            </button>
          ) : (
            <button className="ui large fluid red button" type="submit">
              Sign Up
            </button>
          )}
          <div className="ui error message" />
          {error && (
            <div className="ui negative message">
              <i className="close icon"></i>
              <div className="header">
                {`There was some problem. Please try again later`}
              </div>
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
            <a
              onClick={registerToLogin}
              style={{ color: '#db2828', cursor: 'pointer' }}
            >
              {' '}
              Login
            </a>{' '}
            now!
          </h3>
        </div>
      </div>
    </div>
  )
}
export default Register
