import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../../actions/messageActions'

const BottomPanel = ({ setProgress }) => {
  const { user } = useSelector(state => state.userLogIn)
  const { activeChannel, channelType } = useSelector(state => state.channelInfo)
  const [message, setMessage] = useState('')
  const [media, setMedia] = useState(null)

  const dispatch = useDispatch()

  const sendMessageHandler = e => {
    if (message.trim() === '') return
    e.preventDefault()
    dispatch(
      sendMessage(
        activeChannel,
        user.uid,
        message,
        channelType,
        media,
        setProgress
      )
    )
    setMessage('')
    setMedia(null)
  }

  const mediaMessageHandler = (e, media) => {
    e.preventDefault()
    setMedia({
      type: media,
      file: e.target.files[0],
    })
  }

  const textAreaResize = e => {
    e.preventDefault()
  }

  useEffect(() => {
    $('#media-popup').popup({
      on: 'click',
      hoverable: true,
      transition: 'slide up',
      duration: '1000',
    })
  }, [])

  return (
    <div className="ui raised segment" style={{ textAlign: 'center' }}>
      {media?.type === 'image' ? (
        <img
          src={window.URL.createObjectURL(media.file)}
          type={media.type}
          style={{ marginTop: '1em', maxHeight: '60vw', maxWidth: '60vw' }}
        />
      ) : media?.type === 'video' ? (
        <video
          src={window.URL.createObjectURL(media.file)}
          type={media.type}
          controls="controls"
          style={{ marginTop: '1em', maxHeight: '60vw', maxWidth: '60vw' }}
        />
      ) : media?.type === 'audio' ? (
        <audio
          src={window.URL.createObjectURL(media.file)}
          type={media.type}
          controls="controls"
        />
      ) : null}
      <div
        className="ui form"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <div className="ui icon input" style={{ flexGrow: '1' }}>
          <textarea
            name="send-msg"
            type="text"
            rows="1"
            value={message}
            onChange={e => {
              textAreaResize(e)
              setMessage(e.target.value)
            }}
            placeholder="Type here..."
            style={{ resize: 'none' }}
          />
          <i
            className="ui red photo video icon"
            id="media-popup"
            style={{ cursor: 'pointer', pointerEvents: 'initial' }}
          ></i>
          <div className="ui popup top center basic transition hidden">
            <div className="ui input field item">
              <label htmlFor="video-input" className="ui icon large">
                <i
                  className="film red large circular inverted icon"
                  style={{ cursor: 'pointer' }}
                ></i>
              </label>
              <input
                id="video-input"
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={e => mediaMessageHandler(e, 'video')}
              />
            </div>
            <div className="ui input field item">
              <label htmlFor="image-input" className="ui icon large">
                <i
                  className="image red large circular inverted icon"
                  style={{ cursor: 'pointer' }}
                ></i>
              </label>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => mediaMessageHandler(e, 'image')}
              />
            </div>
            <div className="ui input field item">
              <label htmlFor="audio-input" className="ui icon large">
                <i
                  className="music red large circular inverted icon"
                  style={{ cursor: 'pointer' }}
                ></i>
              </label>
              <input
                id="audio-input"
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={e => mediaMessageHandler(e, 'audio')}
              />
            </div>
          </div>
        </div>

        <button
          className="ui red icon button"
          onClick={sendMessageHandler}
          style={{ marginLeft: '0.5em', marginRight: '0' }}
        >
          <i className="paper plane large icon"></i>
        </button>
      </div>
    </div>
  )
}

export default BottomPanel
