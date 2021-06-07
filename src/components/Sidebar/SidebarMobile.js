import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddChannel from './AddChanel'
import firebase from '../../firebase'
import {
  getChannelList,
  getPrivateChannelList,
} from '../../actions/messageActions'
import {
  GET_CHANNEL_INFO_SUCCESS,
  SET_ACTIVE_CHANNEL,
} from '../../constants/messageConstants'
import { signOutUser } from '../../actions/userActions'
import AddDirectMessage from './AddDirectMessage'
import EditProfile from './EditProfile'

const SidebarMobile = () => {
  const { user } = useSelector(state => state.userLogIn)
  const { channels } = useSelector(state => state.channelList)
  const { privateChannels } = useSelector(state => state.privateChannelList)
  const { activeChannel } = useSelector(state => state.channelInfo)
  const [showModal, setShowModal] = useState(false)
  const [showDMModal, setShowDMModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const db = firebase.firestore()

  const addChannelHandler = e => {
    e.preventDefault()
    setShowModal(true)
    document.getElementById('sidebar-mobile').classList.remove('visible')
  }

  const addStarredHandler = (e, cid) => {
    e.preventDefault()
    db.collection('users')
      .doc(user.uid)
      .update({
        starred: firebase.firestore.FieldValue.arrayUnion(cid),
      })
  }

  const removeStarredHandler = (e, cid) => {
    e.preventDefault()
    db.collection('users')
      .doc(user.uid)
      .update({
        starred: firebase.firestore.FieldValue.arrayRemove(cid),
      })
  }

  const addDMHandler = e => {
    e.preventDefault()
    setShowDMModal(true)
    document.getElementById('sidebar-mobile').classList.remove('visible')
  }

  const dispatch = useDispatch()

  const signOutHandler = e => {
    e.preventDefault()
    dispatch(signOutUser())
  }

  const changePrivateChannel = (e, cid) => {
    e.preventDefault()
    dispatch({
      type: SET_ACTIVE_CHANNEL,
      payload: { cid, type: 'private' },
    })
    document.getElementById('sidebar-mobile').classList.remove('visible')
  }

  const changeChannel = (e, cid) => {
    e.preventDefault()
    dispatch({
      type: SET_ACTIVE_CHANNEL,
      payload: { cid, type: 'public' },
    })
    document.getElementById('sidebar-mobile').classList.remove('visible')
  }

  const toggleSidebar = e => {
    document.getElementById('sidebar-mobile').classList.remove('visible')
  }

  useEffect(() => {
    $('.ui.accordion').accordion()
    db.collection('users')
      .doc(user.uid)
      .onSnapshot(doc => {
        dispatch(getChannelList(doc))
        dispatch(getPrivateChannelList(doc))
      })
  }, [])

  return (
    <>
      <AddChannel showModal={showModal} setShowModal={setShowModal} />
      <AddDirectMessage
        showDMModal={showDMModal}
        setShowDMModal={setShowDMModal}
      />
      <EditProfile
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
      <div
        id="sidebar-mobile"
        className="ui red inverted vertical borderless menu sidebar"
      >
        <div className="item" style={{ marginBottom: '1em' }}>
          <div className="ui logo icon image">
            <a href="/">
              <img
                src="logo-white.svg"
                alt="logo-white"
                style={{ height: '4em', width: 'auto', marginRight: '2em' }}
              />
            </a>
          </div>
          <a href="/" style={{ color: 'white' }}>
            <b style={{ fontSize: '1.5em' }}>ChatApp</b>
          </a>
          <i className="large close white icon" onClick={toggleSidebar}></i>
        </div>

        <div className="ui inverted fluid accordion item">
          <div className="title">
            <span className="ui logo icon image">
              <img
                src={user.photoURL}
                alt="avatar"
                style={{
                  height: '2.5em',
                  width: '2.5em',
                  borderRadius: '100%',
                  margin: 'auto 1em auto 0.5em',
                }}
              />
            </span>
            <b style={{ fontSize: '1.1em', verticalAlign: 'middle' }}>
              {user.displayName}
            </b>
          </div>
          <div className="content">
            <div className="transition hidden menu">
              <a className="item">
                <span
                  className="ui left icon"
                  style={{
                    fontSize: '1.3em',
                    marginTop: '0.4em',
                  }}
                  onClick={() => setShowProfileModal(true)}
                >
                  <i className="edit icon"></i> Edit Profile
                </span>
              </a>
              <a className="item">
                <span
                  className="ui left icon"
                  style={{ fontSize: '1.3em', marginTop: '0.4em' }}
                  onClick={signOutHandler}
                >
                  <i className="sign out alternate icon"></i> Sign Out
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="ui container">
          <div className="ui inverted fluid accordion item">
            <div className="title">
              <span className="ui left icon" style={{ fontSize: '1.1em' }}>
                <i className=" left white star icon"></i>
                Starred({channels?.filter(channel => channel.starred).length})
              </span>
            </div>
            <div className="content">
              <div className="ui transition hidden vertical secondary menu">
                {channels?.map(
                  channel =>
                    channel.starred && (
                      <a className="item" key={channel.channelId}>
                        <div
                          className="ui left icon"
                          style={{
                            fontSize: '1.2em',
                          }}
                        >
                          <span
                            onClick={e => changeChannel(e, channel.channelId)}
                          >
                            <i className="left hashtag icon"></i>
                            {channel.channelName}
                          </span>
                          <i
                            className="right white star icon"
                            style={{ marginLeft: '1em' }}
                            onClick={e =>
                              removeStarredHandler(e, channel.channelId)
                            }
                          ></i>
                        </div>
                      </a>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="ui inverted fluid accordion item">
            <div className="title">
              <span className="ui left icon" style={{ fontSize: '1.1em' }}>
                <i className=" left white exchange alternate icon"></i>
                Channels({channels?.filter(channel => !channel.starred).length})
              </span>
              <i
                className="white plus icon"
                onClick={addChannelHandler}
                style={{ float: 'right', marginRight: '0' }}
              ></i>
            </div>
            <div className="content">
              <div className="ui transition hidden vertical secondary menu">
                {channels?.map(
                  channel =>
                    !channel.starred && (
                      <a className="item" key={channel.channelId}>
                        <div
                          className="ui left icon"
                          style={{
                            fontSize: '1.2em',
                          }}
                        >
                          <span
                            onClick={e => changeChannel(e, channel.channelId)}
                          >
                            <i className="left hashtag icon"></i>
                            {channel.channelName}
                          </span>
                          {channel.starred ? (
                            <i
                              className="right white star icon"
                              style={{ marginLeft: '1em' }}
                              onClick={e =>
                                removeStarredHandler(e, channel.channelId)
                              }
                            ></i>
                          ) : (
                            <i
                              className="right white outline star icon"
                              style={{ marginLeft: '1em' }}
                              onClick={e =>
                                addStarredHandler(e, channel.channelId)
                              }
                            ></i>
                          )}
                        </div>
                      </a>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="ui inverted fluid accordion item">
            <div className="title">
              <span className="ui left icon" style={{ fontSize: '1.1em' }}>
                <i className=" left white envelope icon"></i>
                Direct Messages({privateChannels?.length})
              </span>
              <i
                className="white plus icon"
                onClick={addDMHandler}
                style={{ float: 'right', marginRight: '0' }}
              ></i>
            </div>
            <div className="content">
              <div
                className="ui transition hidden vertical secondary menu"
                id="dm"
              >
                {privateChannels?.map(channel => (
                  <a className="item" key={channel.channelId}>
                    <div
                      className="ui left icon"
                      style={{
                        fontSize: '1.2em',
                      }}
                    >
                      <span
                        onClick={e =>
                          changePrivateChannel(e, channel.channelId)
                        }
                      >
                        <i className="left at icon"></i>
                        {
                          channel.users[
                            Object.keys(channel.users).filter(
                              key => key !== user.uid
                            )
                          ].name
                        }
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarMobile
