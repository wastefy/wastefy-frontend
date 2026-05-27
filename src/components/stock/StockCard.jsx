/* ================================================
   StockCard.jsx — Tap card → buka Item Detail page
   
   Prioritas gambar thumbnail:
   1. item.imageUrl  → foto yang diupload user
   2. asset kategori → defaultAsset[category] (Buah/Sayur)
   3. fallback       → emoji (kategori lain seperti Protein, dll)
   ================================================ */
import { useApp } from '../../context/AppContext'
import StatusBadge from '../common/StatusBadge'

/* ── Import asset default per kategori ── */
import assetBuah    from '../../assets/images/default-buah.png'
import assetSayuran from '../../assets/images/default-sayur.png'

/* ── Map kategori → asset ── */
const DEFAULT_ASSET = {
  Buah:    assetBuah,
  Sayuran: assetSayuran,
}

function IconTrash({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2"/>
    </svg>
  )
}

export default function StockCard({ item }) {
  const { markUsed, throwAway, openItemDetail, setStocks } = useApp()

  const removeItem = (id) => {
    setStocks(prev => prev.filter(s => s.id !== id))
  }

  /* ── Tentukan thumbnail yang ditampilkan ── */
  const renderThumbnail = () => {
    /* 1. Foto dari user (upload manual / AI) */
    if (item.imageUrl) {
      return <img src={item.imageUrl} alt={item.name} />
    }
    /* 2. Asset default Buah atau Sayuran */
    if (DEFAULT_ASSET[item.category]) {
      return (
        <img
          src={DEFAULT_ASSET[item.category]}
          alt={item.category}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
        />
      )
    }
  }

  return (
    <div
      className="stock-card"
      onClick={() => openItemDetail(item)}
      style={{ cursor: 'pointer' }}
    >
      <div className="stock-card__top">
        {/* Thumbnail */}
        <div className="stock-card__image">
          {renderThumbnail()}
        </div>

        {/* Info */}
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

      {/* Actions */}
      <div className="stock-card__actions" onClick={e => e.stopPropagation()}>
        <button
          className="action-btn action-btn--used"
          onClick={() => markUsed(item.id)}
        >
          Used
        </button>
        <button
          className="action-btn action-btn--throw"
          onClick={() => throwAway(item.id)}
        >
          Throw Away
        </button>
        <button
          className="action-btn action-btn--remove"
          onClick={() => removeItem(item.id)}
          aria-label="Hapus item"
          title="Hapus item"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}