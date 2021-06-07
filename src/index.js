import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './semantic/dist/semantic.min.js'
import './semantic/dist/semantic.min.css'
import './index.css'
import './bootstrap.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
