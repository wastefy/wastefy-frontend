import { useApp } from './context/AppContext'
import { SCREENS } from './constants'

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
  return (
    <div className="phone-wrapper">
      {PAGE_MAP[screen] ?? <LandingPage />}
    </div>
  )
}