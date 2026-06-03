import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import BottomNav from '../../components/layout/BottomNav'
import {
  IconArrowLeft, IconChevronRight, IconPencil,
  IconBell, IconMoon, IconLogout,
} from '../../components/common/Icons'

function getInitials(name = '') {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function SettingsPage() {
  const { navigate, goBack, darkMode, setDarkMode, profile } = useApp()

  const initials = getInitials(profile.name) || '?'

  return (
    <div className="app-screen settings-page">
      {/* <StatusBar variant="light" /> */}

      <div className="app-header">
        <div className="app-header__back-row">
          <button className="app-header__icon-btn" onClick={goBack} aria-label="Go back">
            <IconArrowLeft />
          </button>
          <h1 className="app-header__title">Pengaturan</h1>
        </div>
      </div>

      <div className="app-content settings-content" style={{ padding: '0 16px 110px' }}>
        <div
          className="settings-profile-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(SCREENS.EDIT_PROFILE)}
        >
          <div className="settings-profile-card__left">
            <div className="settings-profile-card__avatar">
              <span style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}>
                {initials}
              </span>
            </div>
            <div>
              <div className="settings-profile-card__name">{profile.name}</div>
              <div className="settings-profile-card__email">{profile.email}</div>
            </div>
          </div>
          <button className="app-header__icon-btn" aria-label="Edit profile" tabIndex={-1}>
            <IconPencil />
          </button>
        </div>

        <div className="settings-menu-card">
          <div className="settings-menu-item" onClick={() => navigate(SCREENS.NOTIF_SETTINGS)}>
            <div className="settings-menu-item__left"><IconBell /> Notifikasi</div>
            <IconChevronRight />
          </div>
          <div className="settings-menu-item" onClick={() => setDarkMode(!darkMode)}>
            <div className="settings-menu-item__left"><IconMoon /> Mode Gelap</div>
            <div className={`toggle toggle--${darkMode ? 'on' : 'off'}`}>
              <div className="toggle__knob" />
            </div>
          </div>
          <div className="settings-menu-item" onClick={() => navigate(SCREENS.LANDING)}>
            <div className="settings-menu-item__left"><IconLogout /> Keluar</div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}