import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addDirectMessage,
  removeChannel,
  removePrivateChannel,
} from '../../actions/messageActions'
import { SET_ACTIVE_CHANNEL } from '../../constants/messageConstants'

const MetaPanelMobile = ({ setShowMetaPanel }) => {
  const { user } = useSelector(state => state.userLogIn)
  const { activeChannel, channelType } = useSelector(state => state.channelInfo)
  const { privateChannels } = useSelector(state => state.privateChannelList)
  const { channels } = useSelector(state => state.channelList)

  const channel = channels?.filter(
    channel => channel.channelId === activeChannel
  )[0]

  const recipent =
    privateChannels?.[0]?.users[
      Object.keys(privateChannels?.[0]?.users).filter(key => key !== user.uid)
    ]

  const dispatch = useDispatch()

  const addDirectMessageHandler = (e, recipentId) => {
    e.preventDefault()
    let recpentExists = false
    privateChannels.forEach(channel => {
      if (Object.keys(channel.users).includes(recipentId)) {
        dispatch({
          type: SET_ACTIVE_CHANNEL,
          payload: {
            cid: channel.channelId,
            type: 'private',
          },
        })
        recpentExists = true
        document.getElementById('meta-panel-mobile').classList.remove('visible')
      }
    })
    if (!recpentExists) {
      addDirectMessage(recipentId, user).then(cid => {
        dispatch({
          type: SET_ACTIVE_CHANNEL,
          payload: {
            cid,
            type: 'private',
          },
        })
      })
      document.getElementById('meta-panel-mobile').classList.remove('visible')
    }
  }

  const removeChannelHandler = e => {
    e.preventDefault()
    removeChannel(activeChannel, user.uid)
    dispatch({
      type: SET_ACTIVE_CHANNEL,
      payload: { cid: channels[0].channelId, type: 'public' },
    })
  }

  const removePrivateChannelHandler = e => {
    e.preventDefault()
    removePrivateChannel(activeChannel, user.uid, privateChannels[0].users)
    dispatch({
      type: SET_ACTIVE_CHANNEL,
      payload: { cid: channels[0].channelId, type: 'public' },
    })
  }

  useEffect(() => {
    $('.ui.accordion').accordion()
  })
  return (
    <div
      className="ui raised segment"
      style={{ display: 'flex', height: '100%', flexFlow: 'column nowrap' }}
    >
      <h3>
        About
        <i
          className="right close icon"
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={() =>
            document
              .getElementById('meta-panel-mobile')
              .classList.remove('visible')
          }
        ></i>
      </h3>

      {channelType === 'public' ? (
        <>
          <div className="ui styled accordion" style={{ fontSize: '1.1em' }}>
            <div className="title">
              <i className="info circle icon"></i>
              Description
            </div>
            <div className="content">
              <p>{channel?.channelDescription}</p>
            </div>
            <div className="title">
              <i className="users icon"></i>
              Users
            </div>
            <div className="content" style={{ overflowY: 'scroll' }}>
              {channel?.users.map(recipent => (
                <div key={recipent.uid} style={{ marginBottom: '1em' }}>
                  <img
                    className="ui middleAligned image"
                    src={recipent.photoURL}
                    style={{
                      display: 'inline-block',
                      height: '2em',
                      width: '2em',
                      borderRadius: '10%',
                    }}
                  />
                  <span
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      fontWeight: 'bold',
                      marginLeft: '1em',
                    }}
                  >
                    {recipent.name}
                  </span>
                  {recipent.uid !== user.uid && (
                    <span
                      className="ui red button"
                      onClick={e => addDirectMessageHandler(e, recipent.uid)}
                      style={{
                        float: 'right',
                        padding: '0.3em 0.5em',
                        verticalAlign: 'middle',
                      }}
                    >
                      <i
                        className="comment dots outline large icon"
                        style={{ margin: '0' }}
                      ></i>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="title">
              <i className="pen fancy icon"></i>
              Created By
            </div>
            <div className="content">
              <p>{channel?.createdBy.name}</p>
            </div>
          </div>
          <div
            className="ui red fluid large button"
            onClick={removeChannelHandler}
            style={{ marginTop: 'auto' }}
          >
            Leave Channel
          </div>
        </>
      ) : (
        <>
          <img src={recipent?.photoURL} />
          <div className="ui styled accordion" style={{ fontSize: '1.1em' }}>
            <div className="title">
              <i className="info circle icon"></i>
              About
            </div>
            <div className="content">
              <p>{recipent?.about}</p>
            </div>
          </div>
          <div
            className="ui red fluid large button"
            onClick={removePrivateChannelHandler}
            style={{ marginTop: 'auto' }}
          >
            Delete Chat
          </div>
        </>
      )}
    </div>
  )
}

export default MetaPanelMobile
