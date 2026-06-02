import { useState } from 'react'
import axios from 'axios'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import { BASE_URL } from '../../constants'
import setPasswordIcon from '../../assets/images/icon-set new password.png'

export default function SetPasswordPage() {
  const { navigate } = useApp()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleReset = async () => {
    if (!password || !confirm) {
      setErrorMessage('Semua field harus diisi.')
      return
    }
    if (password !== confirm) {
      setErrorMessage('Kata sandi tidak cocok.')
      return
    }

    const email = localStorage.getItem('resetEmail')
    if (!email) {
      setErrorMessage('Sesi tidak valid. Ulangi dari lupa kata sandi.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')
      await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        email,
        newPassword: password
      })

      localStorage.removeItem('resetEmail') // bersihkan sesi
      alert('Kata sandi berhasil diatur ulang. Silakan masuk.')
      navigate(SCREENS.LOGIN)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Gagal mengatur ulang kata sandi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen auth-screen--centered">
      <div className="auth-body auth-body--centered">
        <div className="auth-page-icon">
          <img src={setPasswordIcon} alt="Set Password" className="auth-page-icon__img" />
        </div>

        <h1 className="auth-title">Atur Kata Sandi Baru</h1>
        <p className="auth-subtitle">
          Masukkan kata sandi baru Anda di bawah ini untuk memulihkan akses.
        </p>

        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
            {errorMessage}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Kata Sandi Baru</label>
          <input
            className="form-input"
            type="password"
            placeholder="Masukkan kata sandi baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Konfirmasi Kata Sandi</label>
          <input
            className="form-input"
            type="password"
            placeholder="Konfirmasi kata sandi"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
          />
        </div>

        <button className="btn btn--primary" onClick={handleReset} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Atur Ulang Kata Sandi'}
        </button>
      </div>
    </div>
  )
}