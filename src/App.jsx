import { useApp } from './context/AppContext'
import { SCREENS } from './constants'
import DesktopNavbar from './components/layout/NavBar'
import BottomNav from './components/layout/BottomNav'

import LandingPage        from './pages/auth/LandingPage'
import LoginPage          from './pages/auth/LoginPage'
import SignUpPage         from './pages/auth/SignUpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import OTPPage            from './pages/auth/OTPPage'
import SetPasswordPage    from './pages/auth/SetPasswordPage'

import HomePage           from './pages/main/HomePage'
import NotificationPage   from './pages/main/NotificationPage'
import HistoryPage        from './pages/main/HistoryPage'
import SettingsPage       from './pages/main/SettingsPage'
import NotifSettingsPage  from './pages/main/NotifSettingsPage'
import EditProfilePage    from './pages/main/EditProfilePage'
import ItemDetailPage     from './pages/main/ItemDetailPage'   

const PAGE_MAP = {
  [SCREENS.LANDING]:        <LandingPage />,
  [SCREENS.LOGIN]:          <LoginPage />,
  [SCREENS.SIGNUP]:         <SignUpPage />,
  [SCREENS.FORGOT]:         <ForgotPasswordPage />,
  [SCREENS.OTP]:            <OTPPage />,
  [SCREENS.SET_PASSWORD]:   <SetPasswordPage />,
  [SCREENS.HOME]:           <HomePage />,
  [SCREENS.NOTIFICATION]:   <NotificationPage />,
  [SCREENS.HISTORY]:        <HistoryPage />,
  [SCREENS.SETTINGS]:       <SettingsPage />,
  [SCREENS.NOTIF_SETTINGS]: <NotifSettingsPage />,
  [SCREENS.EDIT_PROFILE]:   <EditProfilePage />,
  [SCREENS.ITEM_DETAIL]:    <ItemDetailPage />,    
}

export default function App() {
  const { screen } = useApp()

  const isMainScreen = [
    SCREENS.HOME,
    SCREENS.NOTIFICATION,
    SCREENS.HISTORY,
    SCREENS.SETTINGS,
    SCREENS.NOTIF_SETTINGS,
    SCREENS.EDIT_PROFILE,
    SCREENS.ITEM_DETAIL
  ].includes(screen)

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