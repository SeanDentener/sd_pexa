import { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Dialog, Stack, TextField } from '@fluentui/react'
import { CopyRegular } from '@fluentui/react-icons'

import { CosmosDBStatus } from '../../api'
//import Contoso from '../../assets/CCT/PEXA.png'
import CCTLogo from '../../assets/CCT/cct-logo.svg'
import SmartCapeLogo from '../../assets/CCT/Smartcape logo_pwrdby.png'
import { HistoryButton, ShareButton } from '../../components/common/Button'
import { AppStateContext } from '../../state/AppProvider'

import styles from './Layout.module.css'

const Layout = () => {
  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false)
  const [copyClicked, setCopyClicked] = useState<boolean>(false)
  const [copyText, setCopyText] = useState<string>('Copy URL')
  const [shareLabel, setShareLabel] = useState<string | undefined>('Share')
  const [hideHistoryLabel, setHideHistoryLabel] = useState<string>('Hide chat history')
  const [showHistoryLabel, setShowHistoryLabel] = useState<string>('Show chat history')
  const [cctlogo, setLogo] = useState('')
  const [smartcapelogo, setSmartCapeLogo] = useState('')
  const appStateContext = useContext(AppStateContext)
  const ui = appStateContext?.state.frontendSettings?.ui

  const handleShareClick = () => {
    setIsSharePanelOpen(true)
  }

  const handleSharePanelDismiss = () => {
    setIsSharePanelOpen(false)
    setCopyClicked(false)
    setCopyText('Copy URL')
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyClicked(true)
  }

  const handleHistoryClick = () => {
    appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
  }

  useEffect(() => {
    if (!appStateContext?.state.isLoading) {
      setLogo(CCTLogo)
      setSmartCapeLogo(SmartCapeLogo)
    }
  }, [appStateContext?.state.isLoading])

  useEffect(() => {
    if (copyClicked) {
      setCopyText('Copied URL')
    }
  }, [copyClicked])

  useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setShareLabel(undefined)
        setHideHistoryLabel('Hide history')
        setShowHistoryLabel('Show history')
      } else {
        setShareLabel('Share')
        setHideHistoryLabel('Hide chat history')
        setShowHistoryLabel('Show chat history')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.layout}>
      <header className={styles.header} role={'banner'}>
        <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            <img src={cctlogo} className={styles.headerIcon} aria-hidden="true" alt="" />
            {/* <Link to="/" className={styles.headerTitleContainer}>
              <h1 className={styles.headerTitle}>{ui?.title}</h1>Test
            </Link> */}
          </Stack>
         
          {/* <Stack horizontal tokens={{ childrenGap: 4 }} className={styles.shareButtonContainer}>
            {appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured && ui?.show_chat_history_button !== false && (
              <HistoryButton
                onClick={handleHistoryClick}
                text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel}
              />
            )}
            {ui?.show_share_button && <ShareButton onClick={handleShareClick} text={shareLabel} />}
          </Stack> */}
        </Stack>
      </header>
      <div className={styles.noticeArea} hidden>
      Hi I’m  <strong>PEXA</strong> , your AI HR <strong>P</strong>olicy <strong>EX</strong>planation <strong>A</strong>ssistant.
      <p>    
      I am still in my infancy and constantly improving my knowledge about the Cities policies in order provide the best responses to your queries.
      <br/>
      I am still learning so please bear with me if my responses are not 100% accurate, therefore always verify with your HR helpdesk.
      </p>
        </div>
      <Outlet />
      <Dialog
        onDismiss={handleSharePanelDismiss}
        hidden={!isSharePanelOpen}
        styles={{
          main: [
            {
              selectors: {
                ['@media (min-width: 480px)']: {
                  maxWidth: '600px',
                  background: '#FFFFFF',
                  boxShadow: '0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  minHeight: '100px'
                }
              }
            }
          ]
        }}
        dialogContentProps={{
          title: 'Share the web app',
          showCloseButton: true
        }}>
        <Stack horizontal verticalAlign="center" style={{ gap: '8px' }}>
          <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
          <div
            className={styles.copyButtonContainer}
            role="button"
            tabIndex={0}
            aria-label="Copy"
            onClick={handleCopyClick}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? handleCopyClick() : null)}>
            <CopyRegular className={styles.copyButton} />
            <span className={styles.copyButtonText}>{copyText}</span>
          </div>
        </Stack>
      </Dialog>
      
      <footer _ngcontent-ng-c2412955180="" >
        <div _ngcontent-ng-c2412955180="" className={styles.footer}>
          <p _ngcontent-ng-c2412955180="">© Copyright 2024. City of Cape Town. All rights reserved.</p><p _ngcontent-ng-c2412955180="">
            <a _ngcontent-ng-c2412955180="" href="https://www.capetown.gov.za/General/Contact-us" target="_blank" aria-label="Contact Us">Contact Us</a>
             | <a _ngcontent-ng-c2412955180="" href="https://www.capetown.gov.za/General/Terms-of-use" target="_blank" aria-label="Terms and Conditions">Terms</a>
              | <a _ngcontent-ng-c2412955180="" href="https://www.capetown.gov.za/General/Privacy" target="_blank" >Privacy Policy</a>
              | <Link to="/disclaimer" target="_blank" aria-label="Disclaimer">Disclaimer</Link>
              
              </p>
              <Stack horizontal tokens={{ childrenGap: 4 }} className={styles.shareButtonContainer}>
          <Stack horizontal verticalAlign="center">
          <img src={smartcapelogo} className={styles.smartCapeIcon} aria-hidden="true" alt="" />
          </Stack>
          </Stack>
              </div>
      </footer>
      
    </div>
  )
}

export default Layout
