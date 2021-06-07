import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCwF9OsxBTNFymq9uJp42rlBzWcP-TDd2M',
  authDomain: 'slack-clone-dbz.firebaseapp.com',
  projectId: 'slack-clone-dbz',
  storageBucket: 'slack-clone-dbz.appspot.com',
  messagingSenderId: '702334520488',
  appId: '1:702334520488:web:680ec761625500c1cf069d',
  measurementId: 'G-2RMSNRPK5Z',
}

firebase.initializeApp(firebaseConfig)

export default firebase
