import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import NavBar from "../../components/layout/NavBar";
import BottomNav from '../../components/layout/BottomNav'
import EmptyState from '../../components/common/EmptyState'
import { IconSettings } from '../../components/common/Icons'
import mascotNotification from '../../assets/images/mascot-notification.png'

export default function NotificationPage() {
  const { notifications, navigate } = useApp()

  return (
    <div className="app-screen">
      {/* <StatusBar variant="light" /> */}
      <NavBar />

      <div className="app-header">
        <h1 className="app-header__title">Notifikasi</h1>
        <button
          className="app-header__icon-btn"
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
          <>
            <p className="section-label">Hari ini</p>
            {notifications.map((n) => (
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
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
