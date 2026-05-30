import { Bell, History, LayoutDashboard, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SCREENS } from "../../constants";

export default function DesktopNavbar() {
  const { screen, navigate } = useApp();

  const items = [
    {
      label: "Dashboard",
      screen: SCREENS.HOME,
      icon: LayoutDashboard,
    },
    {
      label: "Riwayat",
      screen: SCREENS.HISTORY,
      icon: History,
    },
    {
      label: "Notifikasi",
      screen: SCREENS.NOTIFICATION,
      icon: Bell,
    },
    {
      label: "Pengaturan",
      screen: SCREENS.SETTINGS,
      icon: Settings,
    },
  ];

  return (
    <header className="desktop-navbar">
      <div className="desktop-navbar__brand">Wastefy</div>

      <nav className="desktop-navbar__menu">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.screen}
              className={`desktop-navbar__item ${
                screen === item.screen ? "desktop-navbar__item--active" : ""
              }`}
              onClick={() => navigate(item.screen)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
