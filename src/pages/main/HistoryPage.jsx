import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import BottomNav from '../../components/layout/BottomNav'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { IconSettings } from '../../components/common/Icons'
import mascotHistory from '../../assets/images/mascot-history.png'
import assetBuah    from '../../assets/images/default-buah.png'
import assetSayuran from '../../assets/images/default-sayur.png'

const DEFAULT_ASSET = {
  Buah:    assetBuah,
  Sayuran: assetSayuran,
}

const FILTERS = [
  { label: 'Semua',    value: 'all'    },
  { label: 'Terpakai',   value: 'used'   },
  { label: 'Terbuang', value: 'wasted' },
]

export default function HistoryPage() {
  const {
    history,
    historyFilter,
    setHistoryFilter,
    addBackToStock,
    navigate,
  } = useApp()

  const filtered = history.filter((h) =>
    historyFilter === 'all' ? true : h.status === historyFilter
  )

  return (
    <div className="app-screen">
      {/* <StatusBar variant="light" /> */}

      <div className="app-header">
        <h1 className="app-header__title">Riwayat</h1>
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
            className={`filter-tab ${historyFilter === value ? 'filter-tab--active' : ''}`}
            onClick={() => setHistoryFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="app-content">
        {filtered.length === 0 ? (
          <EmptyState
            image={mascotHistory}
            text="Setelah item dihapus dari daftar stok Anda, mereka akan muncul di sini untuk akses yang mudah dan penggunaan ulang."
          />
        ) : (
          <>
            <p className="section-label">
              {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>

            {filtered.map((item) => (
              <div key={item.id} className="history-card">
                <div className="stock-card__top">
                  <div className="stock-card__image">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} />
                      : <span style={{ fontSize: 28 }}>{item.emoji ?? '🥗'}</span>
                    }
                  </div>
                  <div className="stock-card__info">
                    <div className="stock-card__name-row">
                      <span className="stock-card__name">{item.name}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="stock-card__detail">
                      <div>Kondisi: {item.conditionLabel ?? item.condition ?? '—'}</div>
                      <div>Lokasi: {item.storedIn ?? '—'}</div>
                      <div>Tanggal beli: {item.buyDate ?? item.inputDate ?? '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="history-card__footer">
                  <span>
                    {item.status === 'used'
                      ? `Terpakai pada ${item.date}`
                      : `Terbuang pada ${item.date}${item.isExpired ? ' (Kadaluwarsa)' : ''}`
                    }
                  </span>
                  {item.status === 'wasted' && (
                    <button
                      className="history-card__add-back"
                      onClick={() => addBackToStock(item.id)}
                    >
                      Tambahkan Kembali ke Stok
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
