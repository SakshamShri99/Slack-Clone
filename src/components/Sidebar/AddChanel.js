import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { addChannel, addChannelViaId } from '../../actions/messageActions'
import { SET_ACTIVE_CHANNEL } from '../../constants/messageConstants'

const AddChanel = ({ showModal, setShowModal }) => {
  const [channelId, setChannelId] = useState('')
  const [channelName, setChannelName] = useState('')
  const [channelDescription, setChannelDescription] = useState('')

  const { user } = useSelector(state => state.userLogIn)

  const dispatch = useDispatch()

  const addChannelHandler = e => {
    e.preventDefault()
    addChannel(channelName.trim(), channelDescription.trim(), user).then(
      cid => {
        setShowModal(false)
        setChannelName('')
        setChannelDescription('')
        dispatch({
          type: SET_ACTIVE_CHANNEL,
          payload: {
            cid,
            type: 'public',
          },
        })
        document.getElementById('sidebar-mobile').classList.remove('visible')
      }
    )
  }

  const addChannelViaIdHandler = e => {
    e.preventDefault()
    addChannelViaId(channelId.trim(), user)
    setShowModal(false)
    setChannelId('')
    dispatch({
      type: SET_ACTIVE_CHANNEL,
      payload: {
        cid: channelId.trim(),
        type: 'public',
      },
    })
    document.getElementById('sidebar-mobile').classList.remove('visible')
  }

  useEffect(() => {
    $('.ui.form').form({
      fields: {
        channelName: {
          identifier: 'channel-name',
          rules: [
            {
              type: 'empty',
              prompt: 'Empty',
            },
          ],
        },
        channelDescription: {
          identifier: 'channel-desc',
          rules: [
            {
              type: 'empty',
              prompt: 'Empty',
            },
          ],
        },
      },
    })
  })

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>Add Channel</Modal.Title>
        <i
          className="close icon"
          onClick={() => setShowModal(false)}
          style={{ cursor: 'pointer' }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <div className="ui two column very relaxed stackable grid">
          <div className="ui vertical divider">Or</div>
          <div className="column">
            <form className="ui form" onSubmit={addChannelHandler}>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="hashtag icon"></i>
                  <input
                    type="text"
                    name="channel-name"
                    placeholder="Channel name..."
                    value={channelName}
                    onChange={e => setChannelName(e.target.value)}
                  />
                </div>
              </div>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="pen alternate icon"></i>
                  <input
                    type="text"
                    name="channel-desc"
                    placeholder="Somethig about channel..."
                    value={channelDescription}
                    onChange={e => setChannelDescription(e.target.value)}
                  />
                </div>
              </div>
              <button className="ui fluid green inverted button" type="submit">
                Create Channel
              </button>
              <div className="ui error message" />
            </form>
          </div>
          <div className="middle aligned column">
            <form className="ui form" onSubmit={addChannelViaIdHandler}>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="hashtag icon"></i>
                  <input
                    type="text"
                    name="channel-Id"
                    placeholder="Channel Id..."
                    value={channelId}
                    onChange={e => setChannelId(e.target.value)}
                  />
                </div>
              </div>
              <button className="ui fluid green inverted button" type="submit">
                Join Channel
              </button>
              <div className="ui error message" />
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddChanel
