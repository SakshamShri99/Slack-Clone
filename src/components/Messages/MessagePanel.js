import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import firebase from '../../firebase'
import Message from './Message'

const MessagePanel = ({ progress }) => {
  const { activeChannel, channelType } = useSelector(state => state.channelInfo)
  const [messages, setMessages] = useState([])

  const db = firebase.firestore()

  useEffect(() => {
    if (channelType === 'public') {
      db.collection('channels')
        .doc(activeChannel)
        .collection('messages')
        .get()
        .then(docs => {
          const mgs = []
          docs.forEach(doc => mgs.push(doc.data()))
          setMessages(mgs)
        })

      db.collection('channels')
        .doc(activeChannel)
        .collection('messages')
        .onSnapshot(snapshot => {
          const mgs = snapshot.docs.map(doc => doc.data())
          setMessages(mgs)
        })
    } else {
      db.collection('private_channels')
        .doc(activeChannel)
        .collection('messages')
        .get()
        .then(docs => {
          const mgs = []
          docs.forEach(doc => mgs.push(doc.data()))
          setMessages(mgs)
        })

      db.collection('private_channels')
        .doc(activeChannel)
        .collection('messages')
        .onSnapshot(snapshot => {
          const mgs = snapshot.docs.map(doc => doc.data())
          setMessages(mgs)
        })
    }
  }, [activeChannel])

  return (
    <div
      className="ui raised segment"
      style={{
        flexGrow: '1',
        maxHeight: '80vh',
        overflowY: 'scroll',
        margin: '-0.2em 0',
        flexFlow: 'column',
      }}
    >
      {messages.map(message => {
        return (
          <Message
            key={message.timestamp}
            message={message}
            progress={progress}
          />
        )
      })}
    </div>
  )
}

export default MessagePanel
