import { useApp } from '../../context/AppContext'
import StatusBar from '../../components/layout/StatusBar'
import BottomNav from '../../components/layout/BottomNav'
import { IconArrowLeft } from '../../components/common/Icons'

const OPTIONS = [
  { label: 'Allow', value: 'allow' },
  { label: 'Block', value: 'block' },
]

export default function NotifSettingsPage() {
  const { goBack, notifSetting, setNotifSetting } = useApp()

  return (
    <div className="app-screen">
      {/* <StatusBar variant="light" /> */}

      <div className="app-header">
        <div className="app-header__back-row">
          <button
            className="app-header__icon-btn"
            onClick={goBack}
            aria-label="Go back"
          >
            <IconArrowLeft />
          </button>
          <h1 className="app-header__title">Notifikasi</h1>
        </div>
      </div>

      <div className="app-content" style={{ padding: '0 16px 110px' }}>
        <div className="radio-card">
          {OPTIONS.map(({ label, value }) => (
            <div
              key={value}
              className="radio-item"
              onClick={() => setNotifSetting(value)}
            >
              <div className={`radio-item__circle ${notifSetting === value ? 'radio-item__circle--selected' : ''}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
