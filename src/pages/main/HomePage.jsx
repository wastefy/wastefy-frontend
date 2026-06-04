import { useApp } from '../../context/AppContext'
import { SCREENS, STOCK_STATUS } from '../../constants'
import StockCard from '../../components/stock/StockCard'
import EmptyState from '../../components/common/EmptyState'
import AddItemModal from '../../components/modals/AddItemModal'
import SuccessModal from '../../components/modals/SuccessModal'
import { IconSettings, IconPlus } from '../../components/common/Icons'
import mascotDashboard from '../../assets/images/mascot-dashboard.png'

const FILTERS = [
  { label: 'Semua', value: 'all' },
  { label: 'Segar', value: STOCK_STATUS.FRESH },
  { label: 'Segera', value: STOCK_STATUS.SOON },
  { label: 'Kadaluwarsa', value: STOCK_STATUS.EXPIRED },
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

  const totalFresh = stocks.filter((s) => s.status === STOCK_STATUS.FRESH).length
  const totalSoon = stocks.filter((s) => s.status === STOCK_STATUS.SOON).length
  const totalExpired = stocks.filter((s) => s.status === STOCK_STATUS.EXPIRED).length

  return (
    <div className="app-screen =page">
      <div className="container">
        <div className="home-header">
          <div>
            <h1 className="header__title">Dashboard</h1>
          </div>

          <button
            className="header__settings"
            onClick={() => navigate(SCREENS.SETTINGS)}
            aria-label="Settings"
          >
            <IconSettings />
          </button>
        </div>
            <div className="toolbar">
          <div className="filter-tabs">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                className={`filter-tab ${
                  stockFilter === value ? 'filter-tab--active' : ''
                }`}
                onClick={() => setStockFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
              className="home-add-btn"
              onClick={() => setAddModalOpen(true)}
            >
              <IconPlus size={35} />
        </button>
      </div>

      <div className="app-content home-content">
          {filtered.length === 0 ? (
            <EmptyState
              image={mascotDashboard}
              text="Tambahkan item pertama Anda untuk memulai pengelolaan stok makanan yang lebih baik."
            />
          ) : (
            <div className="stock-grid">
              {filtered.map((item) => (
                <StockCard key={item.id} item={item} />
              ))}
            </div>
          )}
      </div>

      </div>

  
      <button
        className="fab"
        onClick={() => setAddModalOpen(true)}
        aria-label="Add item"
      >
        <IconPlus />
      </button>

      {addModalOpen && <AddItemModal />}

    </div>
  )
}
