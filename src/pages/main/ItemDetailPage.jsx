import axios from 'axios'
import { useApp } from '../../context/AppContext'
import { STORAGE_TIPS, STATUS_LABELS, BASE_URL } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import BottomNav from '../../components/layout/BottomNav'
import { IconArrowLeft } from '../../components/common/Icons'

import assetBuah from '../../assets/images/default-buah.png'
import assetSayuran from '../../assets/images/default-sayur.png'

const DEFAULT_ASSET = {
  Buah: assetBuah,
  Sayur: assetSayuran,
}

function IconInfo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2" />
    </svg>
  )
}

const STATUS_COLOR = {
  fresh: { bg: 'rgba(76,175,80,0.12)', text: '#2E7D32' },
  soon: { bg: 'rgba(255,193,7,0.15)', text: '#F57F17' },
  expired: { bg: 'rgba(244,67,54,0.12)', text: '#C62828' },
}

export default function ItemDetailPage() {
  const { selectedItem, goBack, markUsed, throwAway, setStocks } = useApp()
  const item = selectedItem

  if (!item) { goBack(); return null }

  const statusColor = STATUS_COLOR[item.status] ?? STATUS_COLOR.fresh
  const storageTip = STORAGE_TIPS[item.category] ?? STORAGE_TIPS.Lainnya

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/api/inventory/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStocks(prev => prev.filter(s => s.id !== item.id))
      goBack()
    } catch (error) {
      alert('Gagal menghapus item. Silakan coba lagi.')
    }
  }

  return (
    <div className="app-screen container">
      {/* <StatusBar variant="light" /> */}

      <div className="app-header">
        <div className="app-header__back-row">
          <button className="app-header__icon-btn" onClick={goBack}>
            <IconArrowLeft />
          </button>
          <h1 className="app-header__title">Item Detail</h1>
        </div>
      </div>

      <div className="app-content" style={{ padding: '0 0 110px' }}>

        <div className="item-detail__hero">
          {item.imageUrl
            ? <img src={item.imageUrl} alt={item.name} className="item-detail__hero-img" />
            : DEFAULT_ASSET[item.category]
              ? <img
                src={DEFAULT_ASSET[item.category]}
                alt={item.category}
                className="item-detail__hero-img"
                style={{ objectFit: 'contain', padding: 32 }}
              />
              : (
                <div className="item-detail__hero-emoji">
                  <span>{EMOJI_MAP[item.category] ?? item.emoji ?? '📦'}</span>
                </div>
              )
          }
          <div
            className="item-detail__status-pill"
            style={{ background: statusColor.bg, color: statusColor.text }}
          >
            <span className="item-detail__status-dot" style={{ background: statusColor.text }} />
            {STATUS_LABELS[item.status]}
          </div>
        </div>

        <div style={{ padding: '0 var(--sp-4)' }}>

          <h2 className="item-detail__name">{item.name}</h2>

          <div className="item-detail__info-card">
            <InfoRow label="Kategori" value={item.category} />
            <InfoRow label="Kondisi" value={item.conditionLabel ?? item.condition} />
            <InfoRow label="Lokasi Simpan" value={item.storedIn} />
            <InfoRow label="Tanggal beli" value={item.buyDate ?? item.inputDate} />
            {item.shelfDays != null && (
              <InfoRow label="Estimasi sisa" value={`${item.shelfDays} hari`} />
            )}
          </div>

          <div className="item-detail__tip-card">
            <div className="item-detail__tip-header">
              <IconInfo size={16} />
              <span>Cara Simpan</span>
            </div>
            <p className="item-detail__tip-text">{storageTip}</p>
          </div>

          <div className="item-detail__actions">
            <button
              className="item-detail__action-btn item-detail__action-btn--used"
              onClick={() => { markUsed(item.id); goBack() }}
            >
              Pakai
            </button>
            <button
              className="item-detail__action-btn item-detail__action-btn--throw"
              onClick={() => { throwAway(item.id); goBack() }}
            >
              Buang
            </button>
          </div>

          <button
            className="item-detail__remove-btn"
            onClick={handleRemove}
          >
            <IconTrash size={14} />
            Hapus item ini
          </button>

        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="item-detail__info-row">
      <span className="item-detail__info-label">{label}</span>
      <span className="item-detail__info-value">{value || '—'}</span>
    </div>
  )
}