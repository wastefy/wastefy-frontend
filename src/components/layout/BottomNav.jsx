import { useApp } from '../../context/AppContext'
import { TABS } from '../../constants'

function IconHome({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}

function IconBell({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconClipboard({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}

const NAV_ITEMS = [
  { tab: TABS.HOME,         Icon: IconHome,      label: 'Home'         },
  { tab: TABS.NOTIFICATION, Icon: IconBell,      label: 'Notification' },
  { tab: TABS.HISTORY,      Icon: IconClipboard, label: 'History'      },
]

export default function BottomNav() {
  const { activeTab, switchTab } = useApp()

  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map(({ tab, Icon, label }) => (
        <button
          key={tab}
          className={`bottom-nav__item ${activeTab === tab ? 'bottom-nav__item--active' : ''}`}
          onClick={() => switchTab(tab)}
          aria-label={label}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
