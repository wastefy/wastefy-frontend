/* ================================================
   StatusBar.jsx — iOS-style status bar
   ================================================ */

export default function StatusBar({ variant = 'light' }) {
  const isDark = variant === 'dark'
  const iconColor = isDark ? '#F5F0E8' : '#1A1A1A'

  return (
    <div className={`status-bar status-bar--${variant}`}>
      <span className="status-bar__time">9:41</span>
      <div className="status-bar__icons">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill={iconColor}>
          <rect x="0"    y="4"   width="3" height="8"    rx="1" />
          <rect x="4.5"  y="2.5" width="3" height="9.5"  rx="1" />
          <rect x="9"    y="0.5" width="3" height="11.5" rx="1" />
          <rect x="13.5" y="0"   width="3" height="12"   rx="1" opacity="0.3" />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 24 24" fill="none"
          stroke={iconColor} strokeWidth="2" strokeLinecap="round">
          <path d="M1.42 8.58a12.5 12.5 0 0 1 21.16 0" />
          <path d="M5.73 12.89a7.5 7.5 0 0 1 12.54 0" />
          <path d="M10.04 17.2a2.5 2.5 0 0 1 3.92 0" />
          <circle cx="12" cy="21" r="1" fill={iconColor} stroke="none" />
        </svg>

        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x=".5" y=".5" width="21" height="11" rx="3.5"
            stroke={iconColor} strokeOpacity=".35" />
          <rect x="2"  y="2"  width="18" height="8"  rx="2" fill={iconColor} />
          <path d="M24 4v4a2 2 0 0 0 0-4z" fill={iconColor} fillOpacity=".4" />
        </svg>
      </div>
    </div>
  )
}
