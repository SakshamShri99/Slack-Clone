import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeUserAbout,
  changeUserEmail,
  changeUserName,
  changeUserPassword,
  updateProfilePic,
} from '../../actions/userActions'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const EditProfile = ({ showProfileModal, setShowProfileModal }) => {
  const { user } = useSelector(state => state.userLogIn)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [about, setAbout] = useState('')
  const [avatar, setAvatar] = useState(user.photoURL)
  const [media, setMedia] = useState(null)

  const dispatch = useDispatch()

  const uploadImageHandler = e => {
    e.preventDefault()
    setAvatar(window.URL.createObjectURL(e.target.files[0]))
    setMedia({
      type: e.target.files[0].type,
      file: e.target.files[0],
    })
  }

  const updateProfilePicHandler = e => {
    e.preventDefault()
    if (media) dispatch(updateProfilePic(media))
  }

  const changeName = e => {
    e.preventDefault()
    dispatch(changeUserName(name))
  }

  const changeEmail = e => {
    e.preventDefault()
    dispatch(changeUserEmail(user.email, email, password))
  }

  const changeAbout = e => {
    e.preventDefault()
    dispatch(changeUserAbout(about, user.uid))
  }

  const changePassword = e => {
    e.preventDefault()
    dispatch(changeUserPassword(user.email, newPassword, password))
  }

  return (
    <Modal
      show={showProfileModal}
      onHide={setShowProfileModal}
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>Edit Profile</Modal.Title>
        <i
          className="close icon"
          onClick={() => setShowProfileModal(false)}
          style={{ cursor: 'pointer' }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <div className="ui two column very relaxed stackable grid">
          <div className="ui vertical divider"></div>
          <div className="middle aligned center aligned column">
            <form className="ui form" onSubmit={updateProfilePicHandler}>
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1em',
                }}
              >
                <label htmlFor="avatar-input">
                  <img
                    id="avatar"
                    src={avatar}
                    style={{
                      height: 'auto',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="avatarinput"
                  id="avatar-input"
                  style={{ display: 'none' }}
                  defaultValue={avatar?.name}
                  onChange={uploadImageHandler}
                />
              </div>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="image icon"></i>
                  <input
                    type="text"
                    name="avatar"
                    placeholder="Profile picture..."
                    defaultValue={avatar?.name}
                    readOnly
                  />
                </div>
              </div>
              <button className="ui fluid green inverted button" type="submit">
                Update Profile Picture
              </button>
              <div className="ui error message" />
            </form>
          </div>
          <div className="middle aligned column">
            <form className="ui form">
              <div className="ui field">
                <div className="ui left icon action input">
                  <i className="user icon"></i>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <button className="ui button" onClick={changeName}>
                    Done
                  </button>
                </div>
              </div>
              <div className="ui field">
                <div className="ui left icon action input">
                  <i className="pen icon"></i>
                  <input
                    type="text"
                    name="about"
                    placeholder="About yourself..."
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                  />
                  <button className="ui button" onClick={changeAbout}>
                    Done
                  </button>
                </div>
              </div>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="envelope icon"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="New Email..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                    type="password"
                    name="new-password"
                    placeholder="New Password..."
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="ui field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                    type="password"
                    name="password"
                    placeholder="Current Password..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="ui field">
                <button
                  className="ui fluid large green inverted button"
                  onClick={changeEmail}
                >
                  Change Email
                </button>
              </div>
              <div className="ui field">
                <button
                  className="ui fluid large red inverted button"
                  onClick={changePassword}
                >
                  Change Password
                </button>
              </div>
              <div className="ui error message" />
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="ui left labeled action input" style={{ flexGrow: '1' }}>
          <div className="ui label">UID</div>
          <input type="text" defaultValue={user.uid} />
          <button className="ui teal right labeled icon button">
            <i className="copy icon"></i>
            Copy
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditProfile
