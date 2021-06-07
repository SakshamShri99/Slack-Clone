import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const HeadPanel = ({ setShowMetaPanel }) => {
  const { activeChannel, channelType } = useSelector(state => state.channelInfo)
  const { privateChannels } = useSelector(state => state.privateChannelList)
  const users = privateChannels?.[0]?.users
  const { user } = useSelector(state => state.userLogIn)
  const { channels } = useSelector(state => state.channelList)

  const toggleSidebar = e => {
    document.getElementById('sidebar-mobile').classList.add('visible')
  }

  useEffect(() => {
    const msgList = []
    $('.ui.search').search({
      source: msgList,
    })
  }, [activeChannel])

  return (
    <div className="ui raised segment borderless menu" id="head-panel">
      <i
        id="sb-open"
        className="large bars red icon"
        onClick={toggleSidebar}
      ></i>
      <div
        id="head-name"
        className="vertically fitted item"
        onClick={() => {
          setShowMetaPanel('initial')
          document.getElementById('meta-panel-mobile').classList.add('visible')
        }}
      >
        <span className="ui left icon" style={{ fontSize: '1.3em' }}>
          {channelType === 'public' ? (
            <i className="ui hashtag icon"></i>
          ) : (
            <i className="ui at icon"></i>
          )}
          <b>
            {channelType === 'public'
              ? channels?.filter(
                  channel => channel.channelId === activeChannel
                )[0]?.channelName
              : users?.[Object.keys(users).filter(key => key !== user.uid)]
                  .name}
          </b>
          <p style={{ fontSize: '0.9em' }}></p>
        </span>
      </div>
      <div className="vertically fitted right item" id="search">
        <span className="ui search">
          <div className="ui icon input">
            <input
              className="prompt"
              type="text"
              placeholder="Search Messages..."
            />
            <i className="search icon"></i>
          </div>
          <div className="results"></div>
        </span>
      </div>
    </div>
  )
}

export default HeadPanel
