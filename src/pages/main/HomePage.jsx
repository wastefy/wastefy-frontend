import { useApp } from '../../context/AppContext'
import { SCREENS, STOCK_STATUS } from '../../constants'
import NavBar from '../../components/layout/NavBar'
import BottomNav from '../../components/layout/BottomNav'
import StockCard from '../../components/stock/StockCard'
import EmptyState from '../../components/common/EmptyState'
import AddItemModal from '../../components/modals/AddItemModal'
import SuccessModal from '../../components/modals/SuccessModal'
import { IconSettings, IconPlus } from '../../components/common/Icons'
import mascotDashboard from '../../assets/images/mascot-dashboard.png'

const FILTERS = [
  { label: 'Semua',     value: 'all'                   },
  { label: 'Segar',   value: STOCK_STATUS.FRESH      },
  { label: 'Segera',    value: STOCK_STATUS.SOON       },
  { label: 'Kadaluwarsa', value: STOCK_STATUS.EXPIRED    },
]

export default function HomePage() {
  const {
    stocks,
    stockFilter,
    setStockFilter,
    navigate,
    addModalOpen,
    setAddModalOpen,
    successModalOpen,
  } = useApp()

  const filtered = stocks.filter((s) =>
    stockFilter === 'all' ? true : s.status === stockFilter
  )

  return (
    <div className="app-screen">
      {/* <StatusBar variant="light" /> */}
      <div className="app-header">
        <h1 className="app-header__title">Stok Anda</h1>
        <button
          className="app-header__icon-btn"
          onClick={() => navigate(SCREENS.SETTINGS)}
          aria-label="Settings"
        >
          <IconSettings />
        </button>
      </div>

      <div className="filter-tabs">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            className={`filter-tab ${stockFilter === value ? 'filter-tab--active' : ''}`}
            onClick={() => setStockFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="app-content">
        {filtered.length === 0 ? (
          <EmptyState
            image={mascotDashboard}
            text="Tambahkan item pertama Anda untuk memulai pengelolaan stok makanan yang lebih baik."
          />
        ) : (
          filtered.map((item) => <StockCard key={item.id} item={item} />)
        )}
      </div>

      <button
        className="fab"
        onClick={() => setAddModalOpen(true)}
        aria-label="Add item"
      >
        <IconPlus />
      </button>

      {addModalOpen    && <AddItemModal />}
      {successModalOpen && <SuccessModal />}

      <BottomNav />
    </div>
  )
}
