import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { addDirectMessage } from '../../actions/messageActions'
import { SET_ACTIVE_CHANNEL } from '../../constants/messageConstants'

const AddDirectMessage = ({ showDMModal, setShowDMModal }) => {
  const [userUid, setUserUid] = useState('')

  const { user } = useSelector(state => state.userLogIn)

  const dispatch = useDispatch()

  const addDirectMessageHandler = e => {
    e.preventDefault()
    addDirectMessage(userUid.trim(), user).then(cid => {
      setShowDMModal(false)
      dispatch({
        type: SET_ACTIVE_CHANNEL,
        payload: {
          cid,
          type: 'private',
        },
      })
      document.getElementById('sidebar-mobile').classList.remove('visible')
    })
  }

  useEffect(() => {
    $('.ui.form').form({
      fields: {
        userUid: {
          identifier: 'user-uid',
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
      show={showDMModal}
      onHide={() => setShowDMModal(false)}
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>Direct Message</Modal.Title>
        <i
          className="close icon"
          onClick={() => setShowDMModal(false)}
          style={{ cursor: 'pointer' }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <div className="middle aligned column">
          <form className="ui form" onSubmit={addDirectMessageHandler}>
            <div className="ui field">
              <div className="ui left icon input">
                <i className="hashtag icon"></i>
                <input
                  type="text"
                  name="user-uid"
                  placeholder="User Uid..."
                  value={userUid}
                  onChange={e => setUserUid(e.target.value)}
                />
              </div>
            </div>
            <button className="ui fluid green inverted button" type="submit">
              Add User
            </button>
            <div className="ui error message" />
          </form>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddDirectMessage
