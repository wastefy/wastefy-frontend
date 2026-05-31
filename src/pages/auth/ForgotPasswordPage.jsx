import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'

export default function ForgotPasswordPage() {
  const { navigate } = useApp()
  const [email, setEmail] = useState('')

  return (
    <div className="auth-screen auth-screen--centered">
      <div className="auth-body auth-body--centered">
        <h1 className="auth-title">Lupa Kata Sandi</h1>
        <p className="auth-subtitle">
          Masukkan alamat email Anda untuk menerima tautan reset dan memulihkan
          akses ke akun Anda.
        </p>

        <div className="form-group">
          <label className="form-label">Alamat Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn btn--primary" onClick={() => navigate(SCREENS.OTP)}>
          Lanjutkan
        </button>
      </div>
    </div>
  )
}
