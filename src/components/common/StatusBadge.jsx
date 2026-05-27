/* ================================================
   StatusBadge.jsx — Fresh / Soon / Expired / Used / Wasted
   ================================================ */
import { STATUS_LABELS } from '../../constants'

export default function StatusBadge({ status }) {
  return (
    <div className={`status-badge status-badge--${status}`}>
      <div className="status-badge__dot" />
      <span>{STATUS_LABELS[status] ?? status}</span>
    </div>
  )
}
