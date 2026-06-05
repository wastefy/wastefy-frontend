import { useApp } from './context/AppContext'
import { SCREENS } from './constants'
import DesktopNavbar from './components/layout/NavBar'
import BottomNav from './components/layout/BottomNav'

import LandingPage from './pages/auth/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import OTPPage from './pages/auth/OTPPage'
import SetPasswordPage from './pages/auth/SetPasswordPage'
import EmailLoginPage from './pages/auth/EmailLoginPage'

import HomePage from './pages/main/HomePage'
import NotificationPage from './pages/main/NotificationPage'
import HistoryPage from './pages/main/HistoryPage'
import SettingsPage from './pages/main/SettingsPage'
import NotifSettingsPage from './pages/main/NotifSettingsPage'
import EditProfilePage from './pages/main/EditProfilePage'
import ItemDetailPage from './pages/main/ItemDetailPage'

const PAGE_MAP = {
  [SCREENS.LANDING]: <LandingPage />,
  [SCREENS.LOGIN]: <LoginPage />,
  [SCREENS.SIGNUP]: <SignUpPage />,
  [SCREENS.LOGIN_EMAIL]: <EmailLoginPage />,
  [SCREENS.FORGOT]: <ForgotPasswordPage />,
  [SCREENS.OTP]: <OTPPage />,
  [SCREENS.SET_PASSWORD]: <SetPasswordPage />,
  [SCREENS.HOME]: <HomePage />,
  [SCREENS.NOTIFICATION]: <NotificationPage />,
  [SCREENS.HISTORY]: <HistoryPage />,
  [SCREENS.SETTINGS]: <SettingsPage />,
  [SCREENS.NOTIF_SETTINGS]: <NotifSettingsPage />,
  [SCREENS.EDIT_PROFILE]: <EditProfilePage />,
  [SCREENS.ITEM_DETAIL]: <ItemDetailPage />,
}

export default function App() {
  const { screen, initLoading } = useApp()

  const isMainScreen = [
    SCREENS.HOME,
    SCREENS.NOTIFICATION,
    SCREENS.HISTORY,
    SCREENS.SETTINGS,
    SCREENS.NOTIF_SETTINGS,
    SCREENS.EDIT_PROFILE,
    SCREENS.ITEM_DETAIL
  ].includes(screen)
  if (initLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #e0e0e0', borderTopColor: '#2d4a1e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#2d4a1e', fontWeight: 600 }}>Memuat...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }
  return (
    <div className="app-container">
      {isMainScreen && <DesktopNavbar />}

      <div className="phone-wrapper">
        {PAGE_MAP[screen] ?? <LandingPage />}
        {isMainScreen && <BottomNav />}
      </div>
    </div>
  )
}