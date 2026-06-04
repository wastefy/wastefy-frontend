import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { IconSettings } from '../../components/common/Icons'
import mascotHistory from '../../assets/images/mascot-history.png'

const FILTERS = [
  { label: 'Semua', value: 'all' },
  { label: 'Terpakai', value: 'used' },
  { label: 'Terbuang', value: 'wasted' },
]

export default function HistoryPage() {
  const {
    history,
    historyFilter,
    setHistoryFilter,
    addBackToStock,
    navigate,
    fetchHistory,
    historyLoading = false,
  } = useApp()

  useEffect(() => {
    if (typeof fetchHistory === 'function') {
      fetchHistory()
    }
  }, [])

  const filtered = history.filter((item) => {
    if (historyFilter === 'all') return true
    return item?.status?.toLowerCase() === historyFilter?.toLowerCase()
  })

  const totalUsed = history.filter((item) =>
    item?.status === 'used').length
  const totalWasted = history.filter((item) =>
    item?.status === 'wasted').length

  const formatDate = (dateString) => {
    if (!dateString) return '—'

    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="app-screen =page">
      <div className="container">
        <div className="home-header">
        <div>
          <h1 className="header__title">Riwayat</h1>
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
                  historyFilter === value ? 'filter-tab--active' : ''
                }`}
                onClick={() => setHistoryFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        
          </div>

        <div className="app-content history-content">
          {historyLoading ? (
            <div className="history-loading">
              Memuat catatan riwayat...
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              image={mascotHistory}
              text="Setelah item dihapus dari daftar stok Anda, mereka akan muncul di sini untuk akses yang mudah dan penggunaan ulang."
            />
          ) : (
            <>
              <p className="section-label history-section-label">
                {new Date().toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <div className="history-grid">
                {filtered.map((item) => (
                  <article key={item.id || item._id} className="history-card">
                    <div className="history-card__top">
                      <div className="history-card__image">
                        {item.imageUrl || item.file_foto ? (
                          <img
                            src={item.imageUrl || item.file_foto}
                            alt={item.nama_item || item.name}
                          />
                        ) : (
                          <span>{item.emoji ?? '🥗'}</span>
                        )}
                      </div>

                      <div className="history-card__info">
                        <div className="history-card__name-row">
                          <h3 className="history-card__name">
                            {item.nama_item || item.name}
                          </h3>
                          <StatusBadge status={item.status} />
                        </div>

                        <div className="history-card__detail">
                          <div>Kondisi: {item.conditionLabel || item.kondisi_fisik || '—'}</div>
                          <div>Lokasi: {item.storedIn || item.lokasi_penyimpanan || '—'}</div>
                          <div>Tanggal beli: {formatDate(item.buyDate || item.tanggal_beli)}</div>
                        </div>
                      </div>

                    </div>
                    <div className="history-card__footer">
                      <span>
                        {item.status === 'used'
                          ? `Terpakai pada ${formatDate(item.updatedAt || item.date)}`
                          : `Terbuang pada ${formatDate(item.updatedAt || item.date)}${
                              item.isExpired ? ' (Kadaluwarsa)' : ''
                            }`}
                      </span>

                      {item.status === 'wasted' && (
                        <button
                          className="history-card__add-back"
                          onClick={() => addBackToStock(item.id || item._id)}
                        >
                          Tambahkan Kembali
                        </button>
                      )}
                    </div>
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
