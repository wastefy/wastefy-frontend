import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import NavBar from "../../components/layout/NavBar"
import BottomNav from '../../components/layout/BottomNav'
import EmptyState from '../../components/common/EmptyState'
import { IconSettings } from '../../components/common/Icons'
import mascotNotification from '../../assets/images/mascot-notification.png'

function groupByDate(notifications) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const fmt = (d) => d.toLocaleDateString('id-ID')

  const groups = {}
  notifications.forEach((n) => {
    let label = n.time
    if (n.time === fmt(today)) label = 'Hari ini'
    else if (n.time === fmt(yesterday)) label = 'Kemarin'

    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  })
  return groups
}

export default function NotificationPage() {
  const { notifications, navigate } = useApp()
  const grouped = groupByDate(notifications)

  return (
    <div className="app-screen">
      <div className="app-header">
        <h1 className="app-header__title">Notifikasi</h1>
        <button
          className="app-header__icon-btn hide-on-desktop"
          onClick={() => navigate(SCREENS.SETTINGS)}
          aria-label="Settings"
        >
          <IconSettings />
        </button>
      </div>

      <div className="app-content">
        {notifications.length === 0 ? (
          <EmptyState
            image={mascotNotification}
            text="Lihat notifikasi di sini ketika item-item mendekati atau sudah kadaluwarsa."
          />
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <p className="section-label">{label}</p>
              {items.map((n) => (
                <div key={n.id} className="notif-card">
                  <div className="notif-card__avatar">
                    <span>{n.emoji}</span>
                  </div>
                  <div className="notif-card__body">
                    <div className="notif-card__title">{n.title}</div>
                    <div className="notif-card__text">{n.text}</div>
                    <div className="notif-card__time">{n.time}</div>
                  </div>
                  <div
                    className="notif-card__dot"
                    style={{
                      background:
                        n.type === "expired"
                          ? "var(--color-expired)"
                          : n.type === "soon"
                            ? "var(--color-soon)"
                            : "var(--color-fresh)",
                    }}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}