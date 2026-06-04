import { useState } from 'react'
import axios from 'axios'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import { BASE_URL } from '../../constants'


export default function ForgotPasswordPage() {
  const { navigate } = useApp()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const handleSubmit = async () => {
    if (!email) {
      setErrorMessage('Email harus diisi.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email })

      // Simpan email di localStorage supaya bisa dipakai di OTPPage & SetPasswordPage
      localStorage.setItem('resetEmail', email)
      navigate(SCREENS.OTP)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Gagal mengirim OTP. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen auth-screen--centered">
      <div className="auth-body auth-body--centered">
        <h1 className="auth-title">Lupa Kata Sandi</h1>
        <p className="auth-subtitle">
          Masukkan alamat email Anda untuk menerima tautan reset dan memulihkan
          akses ke akun Anda.
        </p>
          {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
            {errorMessage}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Alamat Email</label>
          <input
          className="form-input"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Mengirim...' : 'Lanjutkan'}
          Lanjutkan
        </button>
      </div>
    </div>
  )
}
