import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { IconSettings } from '../../components/common/Icons'
import mascotHistory from '../../assets/images/mascot-history.png'
import assetBuah from '../../assets/images/default-buah.png'
import assetSayur from '../../assets/images/default-sayur.png'

const DEFAULT_ASSET = {
  Buah: assetBuah,
  Sayur: assetSayur,
}

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

  const filtered = history.filter(item => {
    if (historyFilter === 'all') return true
    const itemStatus = item?.status?.toLowerCase()
    return itemStatus === historyFilter?.toLowerCase()
  })

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="app-screen">
      {/* <StatusBar variant="light" /> */}

      <div className="app-header">
        <h1 className="app-header__title">Riwayat</h1>
        <button
          className="app-header__icon-btn hide-on-desktop"
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
        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
            Memuat catatan riwayat...
          </div>
        ) : filtered.length === 0 ? (
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
                    {item.imageUrl || item.file_foto
                      ? <img src={item.imageUrl || item.file_foto} alt={item.nama_item || item.name} />
                      : DEFAULT_ASSET[item.category]
                        ? <img
                          src={DEFAULT_ASSET[item.category]}
                          alt={item.category}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                        />
                        : <span style={{ fontSize: 28 }}>{item.emoji ?? '🥗'}</span>
                    }
                  </div>
                  <div className="stock-card__info">
                    <div className="stock-card__name-row">
                      <span className="stock-card__name">{item.nama_item || item.name}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="stock-card__detail">
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
                      : `Terbuang pada ${formatDate(item.updatedAt || item.date)}${item.isExpired ? ' (Kadaluwarsa)' : ''}`
                    }
                  </span>
                  {item.status === 'wasted' && (
                    <button
                      className="history-card__add-back"
                      onClick={() => addBackToStock(item.id || item._id)}
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
    </div>
  )
}
