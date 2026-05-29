import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import {
  FRESH_ITEMS,
  CONDITION_OPTIONS,
  STORAGE_LOCATIONS,
  AI_DETECT_PROMPT,
  estimateShelfLife,
} from '../../constants'

/* ── Helpers ── */
const EMOJI_MAP = {
  Sayuran: '🥬', Buah: '🍎',
}

const TODAY = new Date().toISOString().split('T')[0]

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function daysToStatus(days) {
  if (days <= 0) return 'expired'
  if (days <= 2) return 'soon'
  return 'fresh'
}

function calcExpiryDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/* Tebak jenis sayur/buah dari nama item */
function guessCategory(name) {
  if (!name) return ''
  const lower = name.toLowerCase()
  const allItems = Object.entries(FRESH_ITEMS)
  for (const [cat, items] of allItems) {
    if (items.some(i => i.toLowerCase() === lower)) return cat
  }
  return ''
}

const BLANK = {
  name:      '',        
  category:  '',         
  condition: '',         
  storedIn:  'Pendingin',   
  buyDate:   TODAY,      
  quantity:  '',
  imageUrl:  null,
  imageFile: null,
}

export default function AddItemModal() {
  const { setAddModalOpen, addStock } = useApp()

  const [form, setForm]                 = useState(BLANK)
  const set = (k, v)                    => setForm((p) => ({ ...p, [k]: v }))
  const [aiState, setAiState]           = useState('idle') // idle|loading|done|error|not_produce
  const [aiResult, setAiResult]         = useState(null)
  const [showRottenConfirm, setRotten]  = useState(false)
  const photoRef                        = useRef(null)

  const conditionOptions = form.category ? (CONDITION_OPTIONS[form.category] ?? []) : []

  const allItems = [
    ...FRESH_ITEMS.Sayuran.map(n => ({ name: n, cat: 'Sayur' })),
    ...FRESH_ITEMS.Buah.map(n    => ({ name: n, cat: 'Buah'    })),
  ].sort((a, b) => a.name.localeCompare(b.name))

  const estimation = (form.name && form.condition && form.storedIn)
    ? estimateShelfLife(form.name, form.condition, form.storedIn, form.category)
    : null

  const handleNameChange = (name) => {
    const cat = guessCategory(name)
    setForm(p => ({ ...p, name, category: cat, condition: '' }))
  }

  const handlePhotoForAI = useCallback(async (file) => {
    if (!file) return
    set('imageUrl', URL.createObjectURL(file))
    set('imageFile', file)
    setAiState('loading')
    setAiResult(null)

    try {
      const base64 = await fileToBase64(file)
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
              { type: 'text',  text: AI_DETECT_PROMPT },
            ],
          }],
        }),
      })

      const data   = await res.json()
      const raw    = data.content?.[0]?.text ?? ''
      const clean  = raw.replace(/```json|```/g, '').trim()
      const result = JSON.parse(clean)

      if (!result.type) { setAiState('not_produce'); return }

      setAiResult(result)
      setAiState('done')

      setForm(p => ({
        ...p,
        name:      result.name      ?? p.name,
        category:  result.type      ?? p.category,
        condition: result.condition ?? p.condition,
      }))

    } catch (err) {
      console.error(err)
      setAiState('error')
    }
  }, [])

  const clearPhoto = () => {
    setForm(p => ({ ...p, imageUrl: null, imageFile: null, name: '', category: '', condition: '' }))
    setAiState('idle')
    setAiResult(null)
  }

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.condition) return
    const condObj = conditionOptions.find(c => c.value === form.condition)
    if (condObj?.multiplier === 0) { setRotten(true); return }
    doAddStock()
  }

  const doAddStock = () => {
    const condObj = conditionOptions.find(c => c.value === form.condition)
    const est     = estimation ?? { days: 3, note: null }
    addStock({
      name:            form.name,
      category:        form.category,
      itemType:        'fresh',
      quantity:        form.quantity,
      storedIn:        form.storedIn,
      buyDate:         form.buyDate,
      imageUrl:        form.imageUrl,
      emoji:           EMOJI_MAP[form.category] ?? '🥗',
      condition:       form.condition,
      conditionLabel:  condObj?.label ?? form.condition,
      estimatedExpiry: calcExpiryDate(est.days),
      shelfDays:       est.days,
      aiConfidence:    aiResult?.confidence ?? null,
      status:          daysToStatus(est.days),
    })
  }

  if (showRottenConfirm) return (
    <div className="modal-overlay" onClick={() => setRotten(false)}>
      <div className="modal-sheet anim-slide-up" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', padding: 'var(--sp-4) 0' }}>
          <div style={{ fontSize: 48, marginBottom: 'var(--sp-4)' }}>⚠️</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-md)', marginBottom: 'var(--sp-2)', color: 'var(--color-text-dark)' }}>
            Item terdeteksi busuk
          </h3>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-gray)', lineHeight: 1.6, marginBottom: 'var(--sp-6)' }}>
            Kondisi item ini sudah tidak layak konsumsi. Tetap tambahkan ke stok?
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            <button className="btn btn--outline" style={{ flex: 1 }} onClick={() => setRotten(false)}>Batal</button>
            <button className="btn btn--primary" style={{ flex: 1, background: 'var(--color-btn-throw)' }}
              onClick={() => { setRotten(false); doAddStock() }}>Tetap Tambah</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
      <div className="modal-sheet anim-slide-up" onClick={e => e.stopPropagation()}>

        <div className="modal-drag-handle" />

        <div className="modal-header">
          <div className="modal-header__title">Tambah Item</div>
          <button className="modal-header__close" onClick={() => setAddModalOpen(false)}>✕</button>
        </div>

        {!form.imageUrl ? (
          <div className="add-photo-zone" onClick={() => photoRef.current?.click()}>
            <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handlePhotoForAI(e.target.files?.[0])} />
            <div className="add-photo-zone__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p className="add-photo-zone__title">
              Foto buah/sayur <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(opsional)</span>
            </p>
            <p className="add-photo-zone__sub">Jika diupload, nama &amp; kondisi terisi otomatis oleh AI</p>
          </div>
        ) : (
          <div className="add-photo-preview">
            <img src={form.imageUrl} alt="preview" className="add-photo-preview__img" />
            <div className="add-photo-preview__overlay">
              <button className="add-photo-preview__change" onClick={clearPhoto}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2"/>
                </svg>
                Hapus
              </button>
            </div>

            {aiState === 'loading' && (
              <div className="add-ai-banner add-ai-banner--loading">
                <div className="add-spinner" />
                <span>AI sedang menganalisa foto...</span>
              </div>
            )}
            {aiState === 'done' && aiResult && (
              <div className="add-ai-banner add-ai-banner--done">
                <span>✅</span>
                <div style={{ flex: 1 }}>
                  <strong>{aiResult.name}</strong> · {aiResult.type} ·{' '}
                  kondisi <strong>{CONDITION_OPTIONS[aiResult.type]?.find(c => c.value === aiResult.condition)?.label ?? aiResult.condition}</strong>
                  {aiResult.confidence < 0.6 && (
                    <span className="add-ai-low-conf"> · Deteksi kurang yakin, periksa di bawah</span>
                  )}
                </div>
              </div>
            )}
            {aiState === 'error' && (
              <div className="add-ai-banner add-ai-banner--warn">
                <span>⚠️</span><span>Gagal menganalisa foto. Isi form manual.</span>
              </div>
            )}
            {aiState === 'not_produce' && (
              <div className="add-ai-banner add-ai-banner--warn">
                <span>🔍</span><span>Foto bukan buah/sayur. Isi form manual.</span>
              </div>
            )}
          </div>
        )}

        {!form.imageUrl && (
          <div className="add-hint-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Tanpa foto? Isi nama dan kondisi secara langsung.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', marginTop: 'var(--sp-3)' }}>

          {/* 1. Nama item — dari AI atau pilih manual */}
          <div className="modal-form-group">
            <label className="modal-label">Nama item</label>
            <select
              className="modal-select"
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
            >
              <option value="">
                {aiState === 'loading' ? 'AI sedang mendeteksi...' : 'Pilih atau tunggu deteksi AI'}
              </option>
              {allItems.map(({ name, cat }) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* 2. Jenis item — otomatis dari nama, tampil sebagai label kecil */}
            {form.category && (
              <div style={{
                marginTop: 'var(--sp-1)',
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)',
              }}>
                <span>{EMOJI_MAP[form.category]}</span>
                <span>Jenis: <strong style={{ color: 'var(--color-text-dark)' }}>{form.category}</strong></span>
                {aiState === 'done' && (
                  <span style={{
                    marginLeft: 4, padding: '1px 7px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(91,138,71,0.12)', color: 'var(--color-accent)',
                    fontSize: 10, fontWeight: 600,
                  }}>dari AI</span>
                )}
              </div>
            )}
          </div>

          {/* 5. Kondisi fisik — dari AI atau pilih manual */}
          <div className="modal-form-group">
            <label className="modal-label">Kondisi fisik</label>
            <select
              className="modal-select"
              value={form.condition}
              disabled={!form.category}
              onChange={e => set('condition', e.target.value)}
              style={{ opacity: form.category ? 1 : 0.45 }}
            >
              <option value="">
                {!form.category
                  ? 'Pilih nama item dahulu'
                  : aiState === 'loading'
                    ? 'AI sedang mendeteksi...'
                    : 'Pilih kondisi'
                }
              </option>
              {conditionOptions.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {form.condition && aiState === 'done' && (
              <div style={{
                marginTop: 'var(--sp-1)',
                fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)',
              }}>
                <span style={{
                  padding: '1px 7px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(91,138,71,0.12)', color: 'var(--color-accent)',
                  fontSize: 10, fontWeight: 600,
                }}>dari AI</span>
                {' '}bisa diubah jika tidak sesuai
              </div>
            )}
          </div>

          {/* Estimasi real-time */}
          {estimation && form.condition !== 'busuk' && (
            <div className={`add-estimation ${estimation.days <= 2 ? 'add-estimation--warn' : 'add-estimation--ok'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
              </svg>
              <div style={{ flex: 1 }}>
                Estimasi: <strong>{estimation.days} hari</strong> di {form.storedIn.toLowerCase()}
                {estimation.note && <div className="add-estimation__note">{estimation.note}</div>}
              </div>
            </div>
          )}
          {form.condition === 'busuk' && (
            <div className="add-estimation add-estimation--rotten">
              <span>⚠️</span>
              <span>Item ini terdeteksi <strong>busuk</strong> — pertimbangkan untuk tidak menyimpannya</span>
            </div>
          )}

          {/* 3. Lokasi simpan — default Kulkas */}
          <div className="modal-form-group">
            <label className="modal-label">
              Lokasi simpan
            </label>
            <select
              className="modal-select"
              value={form.storedIn}
              onChange={e => set('storedIn', e.target.value)}
            >
              {STORAGE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* 4. Tanggal beli — default hari ini */}
          <div className="modal-form-group">
            <label className="modal-label">
              Tanggal beli
              <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 4 }}>
                (default: hari ini)
              </span>
            </label>
            <DatePicker
              className="modal-input" 
              wrapperClassName="date-picker-wrapper" // <--- Tambahkan ini
              selected={form.buyDate ? new Date(form.buyDate) : null}
              maxDate={new Date()}
              dateFormat="yyyy/MM/dd"
              onChange={date => {
                const formattedDate = date ? date.toISOString().split('T')[0] : '';
                set('buyDate', formattedDate);
              }}
              // Gunakan fungsi customInput untuk merender input asli Anda
              customInput={
                <input className="modal-input" type="text" />
              }
            />
          </div>

          {/* Submit */}
          <button
            className="btn btn--primary"
            disabled={!form.name || !form.category || !form.condition}
            style={{ opacity: (!form.name || !form.category || !form.condition) ? 0.5 : 1 }}
            onClick={handleSubmit}
          >
            Tambah stok
          </button>

        </div>
      </div>
    </div>
  )
}