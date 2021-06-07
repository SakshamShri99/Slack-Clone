import React, { useEffect, useState } from 'react'
import moment from 'moment'
import firebase from 'firebase'

const Message = ({ message, progress }) => {
  const db = firebase.firestore()
  const [user, setUser] = useState('')

  useEffect(() => {
    db.collection('users')
      .doc(message.uid)
      .get()
      .then(doc => setUser(doc.data()))
  })

  return (
    <div
      className="ui icon small message"
      style={{
        padding: '0.6em',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <img
        src={user.photoURL}
        alt={'avatar'}
        style={{
          height: '3em',
          width: '3em',
          borderRadius: '10%',
          marginRight: '1em',
        }}
      ></img>
      <div className="content">
        <div className="header" style={{ fontSize: '1em' }}>
          {user.name}
          <span style={{ fontSize: '0.8em', marginLeft: '2em' }}>
            {moment(message.timestamp).format('LT')}
          </span>
        </div>
        {progress[message.timestamp] < 100 && (
          <div
            className="ui inverted segment"
            style={{ height: '10em', width: '10em' }}
          >
            <div className="ui active dimmer">
              <div className="ui active red indeterminate large text loader">
                {progress[message.timestamp]}%
              </div>
            </div>
          </div>
        )}
        {message.mediaType === 'image' ? (
          <img
            src={message.mediaUrl}
            type={message.mediaType}
            style={{ marginTop: '1em', maxHeight: '30em', maxWidth: '60vw' }}
          />
        ) : message.mediaType === 'video' ? (
          <video
            src={message.mediaUrl}
            type={message.mediaType}
            controls="controls"
            style={{ marginTop: '1em', maxHeight: '30em', maxWidth: '60vw' }}
          />
        ) : message.mediaType === 'audio' ? (
          <audio
            src={message.mediaUrl}
            type={message.mediaType}
            controls="controls"
          />
        ) : null}
        <p>{message.message}</p>
      </div>
    </div>
  )
}

export default Message
