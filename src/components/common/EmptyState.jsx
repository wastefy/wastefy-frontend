/* EmptyState.jsx — Blank state with mascot image */

export default function EmptyState({ image, text }) {
  return (
    <div className="empty-state">
      <img
        src={image}
        alt="empty state mascot"
        className="empty-state__image"
      />
      <p className="empty-state__text">{text}</p>
    </div>
  )
}
