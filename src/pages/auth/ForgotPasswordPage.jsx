import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'

export default function ForgotPasswordPage() {
  const { navigate } = useApp()
  const [email, setEmail] = useState('')

  return (
    <div className="auth-screen">
      <StatusBar variant="dark" />

      <div className="auth-body">
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

        <button
          className="btn btn--primary"
          style={{ marginTop: 8 }}
          onClick={() => navigate(SCREENS.OTP)}
        >
          Lanjutkan
        </button>
      </div>
    </div>
  )
}
