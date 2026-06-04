import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
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
  const totalExpired = notifications.filter((n) => n.type === 'expired').length
  const totalSoon = notifications.filter((n) => n.type === 'soon').length

  return (
    <div className="app-screen page">
      <div className="container">
        <div className="notification-header">
          {/* <div>
            <p className="notification-header__eyebrow">Notifikasi</p>
            <h1 className="notification-header__title">Pengingat Stok</h1>
            <p className="notification-header__subtitle">
              Pantau item yang mendekati atau sudah melewati masa simpan.
            </p>
          </div> */}
      <div className="home-header">
          <div>
            <h1 className="header__title">Notifications</h1>
          </div>

          {/* <button
            className="header__settings"
            onClick={() => navigate(SCREENS.SETTINGS)}
            aria-label="Settings"
          >
            <IconSettings />
          </button> */}
        </div>

          <button
            className="notification-header__settings"
            onClick={() => navigate(SCREENS.SETTINGS)}
            aria-label="Settings"
          >
            <IconSettings />
          </button>
        </div>


        <div className="app-content notification-content">
          {notifications.length === 0 ? (
            <EmptyState
              image={mascotNotification}
              text="Lihat notifikasi di sini ketika item-item mendekati atau sudah kadaluwarsa."
            />
          ) : (
            <>
              <p className="section-label notification-section-label">
                Hari ini
              </p>

              <div className="notification-grid">
                {notifications.map((n) => (
                  <article key={n.id} className="notif-card">
                    <div className="notif-card__avatar">
                      <span>{n.emoji}</span>
                    </div>

                    <div className="notif-card__body">
                      <div className="notif-card__title">{n.title}</div>
                      <div className="notif-card__text">{n.text}</div>
                      <div className="notif-card__time">{n.time}</div>
                    </div>

                    <div
                      className={`notif-card__dot notif-card__dot--${n.type}`}
                    />
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}