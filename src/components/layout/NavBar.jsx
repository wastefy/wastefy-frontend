import { Bell, History, Home, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SCREENS } from "../../constants";
import wastefyLogo from "../../assets/images/wastefy-logo.png";

export default function DesktopNavbar() {
  const { screen, navigate } = useApp();

  const items = [
    { label: "Home", screen: SCREENS.HOME, icon: Home },
    { label: "History", screen: SCREENS.HISTORY, icon: History },
    { label: "Notifikasi", screen: SCREENS.NOTIFICATION, icon: Bell },
    { label: "Settings", screen: SCREENS.SETTINGS, icon: Settings },
  ];

  return (
    <header className="desktop-navbar">
    <button
      className="desktop-navbar__brand"
      onClick={() => navigate(SCREENS.HOME)}
    >
      <img
        src={wastefyLogo}
        alt="Wastefy"
        className="desktop-navbar__logo"
      />
    </button>

      <nav className="desktop-navbar__menu">
        {items.map((item) => {
          const Icon = item.icon;
          const active = screen === item.screen;

          return (
            <button
              key={item.screen}
              className={`desktop-navbar__item ${
                active ? "desktop-navbar__item--active" : ""
              }`}
              onClick={() => navigate(item.screen)}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}