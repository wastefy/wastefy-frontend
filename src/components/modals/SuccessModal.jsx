/* SuccessModal.jsx — Item added success feedback */

import { useApp } from '../../context/AppContext'
import { IconCheck } from '../common/Icons'

export default function SuccessModal() {
  const { setSuccessModalOpen } = useApp()

  return (
    <div className="success-overlay">
      <div className="success-card">
        <div className="success-card__icon">
          <IconCheck size={32} />
        </div>
        <p className="success-card__message">
          Item berhasil ditambahkan ke daftar stok!<br />
          Jangan lupa untuk menggunakannya sebelum kadaluwarsa.
        </p>
        <button
          className="btn btn--primary"
          onClick={() => setSuccessModalOpen(false)}
        >
          Selesai
        </button>
      </div>
    </div>
  )
}
