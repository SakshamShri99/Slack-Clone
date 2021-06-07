import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSignedInUser } from '../actions/userActions'
import Sidebar from '../components/Sidebar/Sidebar'
import SidebarMobile from '../components/Sidebar/SidebarMobile'
import HeadPanel from '../components/Messages/HeadPanel'
import MetaPanel from '../components/Messages/MetaPanel'
import MessagePanel from '../components/Messages/MessagePanel'
import BottomPanel from '../components/Messages/BottomPanel'
import firebase from '../firebase'
import MetaPanelMobile from '../components/Messages/MetaPanelMobile'

const Dashboard = ({ history }) => {
  const { loading, user } = useSelector(state => state.userLogIn)
  const [progress, setProgress] = useState({})
  const [showMetaPanel, setShowMetaPanel] = useState('none')

  const dispatch = useDispatch()

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) dispatch(getSignedInUser())
      else history.push('/')
    })
  }, [])

  return (
    <>
      {loading || user === undefined ? (
        <div className="ui active inverted dimmer">
          <div className="ui massive text loader">Loading</div>
        </div>
      ) : (
        <>
          <div
            id="main-grid"
            className="ui padded grid"
            style={{
              height: '100vh',
              width: '100vw',
            }}
          >
            <div
              className="ui row"
              style={{ height: '100vh', paddingTop: '0', paddingBottom: '0' }}
            >
              <SidebarMobile />
              <Sidebar />
              <div
                className="ui column"
                style={{
                  display: 'flex',
                  flexFlow: 'column',
                  height: '100vh',
                  paddingTop: '1em',
                  paddingBottom: '1em',
                  flexGrow: '1',
                }}
              >
                <HeadPanel setShowMetaPanel={setShowMetaPanel} />
                <MessagePanel progress={progress} />
                <BottomPanel setProgress={setProgress} />
              </div>
              <div
                id="meta-panel"
                className="ui five wide column"
                style={{
                  display: `${showMetaPanel}`,
                  height: '100vh',
                  paddingTop: '1em',
                  paddingBottom: '1em',
                  paddingLeft: '0',
                  paddingRight: '1em',
                }}
              >
                <MetaPanel setShowMetaPanel={setShowMetaPanel} />
              </div>
            </div>
          </div>
          <div
            id="meta-panel-mobile"
            className="ui padded grid"
            style={{
              height: '100vh',
              width: '100vw',
            }}
          >
            <div
              className="ui row"
              style={{ height: '100vh', paddingTop: '0', paddingBottom: '0' }}
            >
              <div
                className="ui column"
                style={{
                  display: 'flex',
                  flexFlow: 'column',
                  height: '100vh',
                  paddingTop: '1em',
                  paddingBottom: '1em',
                  flexGrow: '1',
                }}
              >
                <MetaPanelMobile />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Dashboard
