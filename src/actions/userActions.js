import firebase from '../firebase'
import {
  USER_LOG_IN_REQUEST,
  USER_LOG_IN_SUCCESS,
  USER_LOG_IN_FAIL,
  USER_SIGN_OUT,
} from '../constants/userConstants'
import { sendMessage } from './messageActions'

const db = firebase.firestore()
const storage = firebase.storage()
const uniqid = require('uniqid')

export const userSignUp = (displayName, email, password) => async dispatch => {
  dispatch({ type: USER_LOG_IN_REQUEST })
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const { user } = userCredential

      const cid = uniqid()

      db.collection('channels')
        .doc(cid)
        .set({
          channelId: cid,
          channelName: 'welcome',
          channelDescription: 'Welcome to Slack Clone',
          createdBy: {
            uid: user.uid,
            name: displayName,
            timestamp: Date.now(),
          },
          users: firebase.firestore.FieldValue.arrayUnion({
            uid: user.uid,
            name: displayName,
            photoURL:
              'https://firebasestorage.googleapis.com/v0/b/slack-clone-dbz.appspot.com/o/profilepic%2Fdefault-profile.png?alt=media&token=e22ec868-3650-4b0b-bbc8-58db5a0b3c48',
          }),
        })

      dispatch(
        sendMessage(
          cid,
          '7wf2Z2UlsBXvjmtLKJkiccTqeZi1',
          'Welcome to the chat App, we are delighted to have you on board!!',
          'public'
        )
      )

      user.updateProfile({
        displayName,
        photoURL:
          'https://firebasestorage.googleapis.com/v0/b/slack-clone-dbz.appspot.com/o/profilepic%2Fdefault-profile.png?alt=media&token=e22ec868-3650-4b0b-bbc8-58db5a0b3c48',
      })
      db.collection('users')
        .doc(user.uid)
        .set({
          name: displayName,
          email,
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/slack-clone-dbz.appspot.com/o/profilepic%2Fdefault-profile.png?alt=media&token=e22ec868-3650-4b0b-bbc8-58db5a0b3c48',
          channels: firebase.firestore.FieldValue.arrayUnion(cid),
        })

      dispatch({ type: USER_LOG_IN_SUCCESS, payload: user })
    })
    .catch(error => {
      const errorMessage = error.message
      dispatch({ type: USER_LOG_IN_FAIL, payload: errorMessage })
    })
}

export const userLogIn = (email, password) => async dispatch => {
  dispatch({ type: USER_LOG_IN_REQUEST })
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const { user } = userCredential
      dispatch({ type: USER_LOG_IN_SUCCESS, payload: user })
    })
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorMessage)
      dispatch({ type: USER_LOG_IN_FAIL, payload: errorMessage })
    })
}

export const getSignedInUser = () => async dispatch => {
  dispatch({ type: USER_LOG_IN_REQUEST })
  firebase.auth().onAuthStateChanged(user => {
    if (user) dispatch({ type: USER_LOG_IN_SUCCESS, payload: user })
    else dispatch({ type: USER_LOG_IN_FAIL, payload: '' })
  })
}

export const signOutUser = () => async dispatch => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch({ type: USER_SIGN_OUT })
    })
}

export const changeUserName = name => async dispatch => {
  const user = firebase.auth().currentUser

  user
    .updateProfile({
      displayName: name,
    })
    .then(() => {
      dispatch({
        type: USER_LOG_IN_SUCCESS,
        payload: firebase.auth().currentUser,
      })
    })
}

export const changeUserAbout = (about, userUid) => async dispatch => {
  db.collection('users')
    .doc(userUid)
    .update({
      about,
    })
    .then(() => {
      dispatch({
        type: USER_LOG_IN_SUCCESS,
        payload: firebase.auth().currentUser,
      })
    })
}

export const changeUserEmail =
  (currentEmail, newEmail, currentPassword) => async dispatch => {
    const user = firebase.auth().currentUser

    firebase
      .auth()
      .signInWithEmailAndPassword(currentEmail, currentPassword)
      .then(() => {
        user.updateEmail(newEmail).then(() => {
          dispatch({
            type: USER_LOG_IN_SUCCESS,
            payload: firebase.auth().currentUser,
          })
          db.collection('users').doc(user.uid).update({
            email: newEmail,
          })
          dispatch({ type: USER_LOG_IN_SUCCESS, payload: user })
        })
      })
  }

export const changeUserPassword =
  (currentEmail, newPassword, currentPassword) => async dispatch => {
    const user = firebase.auth().currentUser

    firebase
      .auth()
      .signInWithEmailAndPassword(currentEmail, currentPassword)
      .then(() => {
        user.updatePassword(newPassword).then(() => {
          dispatch({
            type: USER_LOG_IN_SUCCESS,
            payload: firebase.auth().currentUser,
          })
        })
      })
  }

export const updateProfilePic = media => async dispatch => {
  const user = firebase.auth().currentUser

  const timestamp = Date.now()

  const upload = storage
    .ref(`profilepic/${user.uid}/${timestamp}`)
    .put(media.file, {
      contentType: media.file.type,
    })

  upload.on(
    'state_changed',
    snapshot => {},
    error => {
      throw new Error(error)
    },
    () => {
      storage
        .ref(`profilepic/${user.uid}`)
        .child(timestamp.toString())
        .getDownloadURL()
        .then(url => {
          user.updateProfile({
            photoURL: url,
          })

          db.collection('users')
            .doc(user.uid)
            .update({
              photoURL: url,
            })
            .then(() => {
              dispatch({
                type: USER_LOG_IN_SUCCESS,
                payload: firebase.auth().currentUser,
              })
            })
        })
    }
  )
}
