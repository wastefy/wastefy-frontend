import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'

export default function EmailLoginPage() {
  const { navigate, loginUser, authLoading } = useApp()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMessage('Email dan kata sandi harus diisi.')
      return
    }
    setErrorMessage('')
    const result = await loginUser(email, password)
    if (result.success) {
      navigate(SCREENS.HOME)
    } else {
      setErrorMessage(result.message)
    }
  }

  return (
    <div className="auth-screen auth-screen--centered">
      <div className="auth-body auth-body--centered">
        <h1 className="auth-title">Masuk dengan Email</h1>
        <p className="auth-subtitle">
          Masukkan email dan kata sandi untuk menerima link verifikasi yang akan dikirim ke email Anda.
        </p>

        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
            {errorMessage}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Kata Sandi</label>
          <input
            className="form-input"
            type="password"
            placeholder="Masukkan kata sandi Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={authLoading}
          />
        </div>

        <div className="form-forgot" onClick={() => navigate(SCREENS.FORGOT)}>
          Lupa Kata Sandi?
        </div>

        <button className="btn btn--primary" onClick={handleSubmit} disabled={authLoading}>
          {authLoading ? 'Memproses...' : 'Lanjutkan'}
        </button>
      </div>
    </div>
  )
}