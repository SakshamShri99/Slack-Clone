import {
  GET_CHANNEL_INFO_REQUEST,
  GET_CHANNEL_LIST_FAIL,
  GET_CHANNEL_LIST_REQUEST,
  GET_CHANNEL_LIST_SUCCESS,
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  GET_PRIVATE_CHANNEL_LIST_REQUEST,
  GET_PRIVATE_CHANNEL_LIST_SUCCESS,
  GET_PRIVATE_CHANNEL_LIST_FAIL,
} from '../constants/messageConstants'
import firebase from '../firebase'

const uniqid = require('uniqid')
const db = firebase.firestore()
const storage = firebase.storage()

export const addChannel = async (channelName, channelDescription, user) => {
  const cid = uniqid().trim()

  await db
    .collection('channels')
    .doc(cid)
    .set({
      channelId: cid,
      channelName,
      channelDescription,
      createdBy: {
        uid: user.uid,
        name: user.displayName,
        timestamp: Date.now(),
      },
      users: firebase.firestore.FieldValue.arrayUnion({
        uid: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
      }),
    })

  await db
    .collection('users')
    .doc(user.uid)
    .update({
      channels: firebase.firestore.FieldValue.arrayUnion(cid),
    })
  return cid
}

export const addChannelViaId = async (cid, user) => {
  await db
    .collection('users')
    .doc(user.uid)
    .update({
      channels: firebase.firestore.FieldValue.arrayUnion(cid),
    })

  await db
    .collection('channels')
    .doc(cid)
    .update({
      users: firebase.firestore.FieldValue.arrayUnion({
        uid: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
      }),
    })
}

export const getChannelList = doc => async dispatch => {
  dispatch({ type: GET_CHANNEL_LIST_REQUEST })
  if (doc.exists && doc.data().channels) {
    await db
      .collection('channels')
      .get()
      .then(channelDoc => {
        const chList = []
        channelDoc.forEach(cdoc => {
          if (doc.data().channels.includes(cdoc.data().channelId)) {
            const chDoc = cdoc.data()
            if (doc.data().starred?.includes(chDoc.channelId))
              chDoc.starred = true
            chList.push(chDoc)
          }
        })
        dispatch({
          type: GET_CHANNEL_LIST_SUCCESS,
          payload: chList,
        })
      })
      .catch(error =>
        dispatch({ type: GET_CHANNEL_LIST_FAIL, payload: error.message })
      )
  } else
    dispatch({
      type: GET_CHANNEL_LIST_FAIL,
      payload: 'No user record found',
    })
}

export const sendMessage =
  (cid, userUid, message, messageType, media, setProgress) =>
  async dispatch => {
    let mode = ''
    if (messageType === 'private') mode = 'private_'
    try {
      dispatch({ type: SEND_MESSAGE_REQUEST })

      const timestamp = Date.now()

      if (media) {
        const upload = storage
          .ref(`${mode}channels/${cid}/${media.type}/${timestamp}`)
          .put(media.file, {
            contentType: media.file.type,
          })

        upload.on(
          'state_changed',
          snapshot => {
            const pg = {}
            pg[timestamp] = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(progress => ({ ...progress, ...pg }))
          },
          error => {
            throw new Error(error)
          },
          () => {
            storage
              .ref(`${mode}channels/${cid}/${media.type}`)
              .child(timestamp.toString())
              .getDownloadURL()
              .then(url => {
                db.collection(`${mode}channels`)
                  .doc(cid)
                  .collection('messages')
                  .doc(timestamp.toString())
                  .update({
                    mediaUrl: url,
                    mediaType: media.type,
                  })
              })
          }
        )
      }
      await db
        .collection(`${mode}channels`)
        .doc(cid)
        .collection('messages')
        .doc(timestamp.toString())
        .set({
          message,
          timestamp,
          uid: userUid,
        })

      dispatch({ type: SEND_MESSAGE_SUCCESS })
    } catch (error) {
      dispatch({ type: SEND_MESSAGE_FAIL, payload: error.message })
    }
  }

export const removeChannel = async (cid, userUid) => {
  await db
    .collection('users')
    .doc(userUid)
    .update({
      channels: firebase.firestore.FieldValue.arrayRemove(cid),
    })
}

export const addDirectMessage = async (dmRecipent, currentUser) => {
  const cid = uniqid().trim()
  let about = {}
  await db
    .collection('users')
    .doc(currentUser.uid)
    .get()
    .then(doc => {
      about = doc.data().about
    })

  await db
    .collection('users')
    .doc(currentUser.uid)
    .get()
    .then(doc => {
      if (doc.data().directMessage[dmRecipent]) {
        const directMessage = doc.data().directMessage

        directMessage[dmRecipent] = directMessage[dmRecipent].slice(0, -5)

        db.collection('users').doc(currentUser.uid).update({
          directMessage,
        })
      } else {
        const directMessage = {}
        const dmForRecipent = {}
        directMessage[dmRecipent] = cid
        dmForRecipent[currentUser.uid] = cid

        db.collection('users')
          .doc(dmRecipent)
          .get()
          .then(recipent => {
            const users = {}
            users[dmRecipent] = {
              name: recipent.data().name,
              photoURL: recipent.data().photoURL,
              about: recipent.data().about,
            }
            users[currentUser.uid] = {
              name: currentUser.displayName,
              photoURL: currentUser.photoURL,
              about,
            }

            db.collection('private_channels').doc(cid).set({
              channelId: cid,
              users,
            })

            db.collection('users')
              .doc(currentUser.uid)
              .update({
                directMessage,
              })
              .then(() => true)
              .catch(error => error.message)

            db.collection('users')
              .doc(dmRecipent)
              .update({
                directMessage: dmForRecipent,
              })
              .then(() => true)
              .catch(error => error.message)
          })
          .catch(error => console.log(error))
      }
    })
  return cid
}

export const getPrivateChannelList = doc => async dispatch => {
  dispatch({ type: GET_CHANNEL_LIST_REQUEST })
  if (doc.exists && doc.data().directMessage) {
    await db
      .collection('private_channels')
      .get()
      .then(channelDoc => {
        const chList = []
        channelDoc.forEach(cdoc => {
          if (
            Object.values(doc.data().directMessage).includes(
              cdoc.data().channelId
            )
          ) {
            const chDoc = cdoc.data()
            // if (doc.data().starred?.includes(chDoc.channelId))
            //   chDoc.starred = true
            chList.push(chDoc)
          }
        })
        dispatch({
          type: GET_PRIVATE_CHANNEL_LIST_SUCCESS,
          payload: chList,
        })
      })
      .catch(error =>
        dispatch({
          type: GET_PRIVATE_CHANNEL_LIST_FAIL,
          payload: error.message,
        })
      )
  } else
    dispatch({
      type: GET_PRIVATE_CHANNEL_LIST_FAIL,
      payload: 'No record found',
    })
}

export const removePrivateChannel = async (cid, userUid, users) => {
  await db.collection('private_channels').doc(cid).update({
    users,
  })

  await db
    .collection('users')
    .doc(userUid)
    .get()
    .then(doc => {
      const { directMessage } = doc.data()

      directMessage[Object.keys(directMessage).filter(key => key !== userUid)] =
        directMessage[
          Object.keys(directMessage).filter(key => key !== userUid)
        ].concat('false')

      db.collection('users').doc(userUid).update({
        directMessage,
      })
    })
}
