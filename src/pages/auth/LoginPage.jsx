import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import AuthLayout from '../../components/layout/AuthLayout'
import googleIcon from '../../assets/images/icon-google.png'
import emailIcon from '../../assets/images/icon-email.png'

export default function LoginPage() {
  // Ambil 'loginUser' dan 'authLoading' dari AppContext
  const { navigate, loginUser, authLoading } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Fungsi untuk menangani submit login
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.')
      return
    }

    // Panggil fungsi login yang terhubung ke Firebase & LocalStorage
    const result = await loginUser(email, password)

    if (result && result.success) {
      navigate(SCREENS.HOME) // Berhasil masuk ke Dashboard
    } else {
      setErrorMessage(result?.message || 'Gagal masuk. Periksa kembali email dan password Anda.')
    }
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">Masuk</h1>
      <p className="auth-subtitle">
        Masukkan email dan password untuk mengakses dan mengelola layanan Anda.
      </p>

      {/* Tampilkan pesan error jika ada */}
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
          disabled={authLoading}
        />
        <div className="form-forgot" onClick={() => navigate(SCREENS.FORGOT)}>
          Lupa Kata Sandi?
        </div>
      </div>

      <div className="auth-actions">
        {/* PERBAIKAN: Menggunakan handleLoginSubmit saat diklik */}
        <button 
          className="btn btn--primary" 
          onClick={handleLoginSubmit}
          disabled={authLoading}
        >
          {authLoading ? 'Memproses...' : 'Masuk'}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-social-row">
          <button className="btn btn--social" disabled={authLoading}>
            <img src={googleIcon} alt="Google" className="btn__icon" />
            <span>Google</span>
          </button>
          <button className="btn btn--social" disabled={authLoading}>
            <img src={emailIcon} alt="Email" className="btn__icon" />
            <span>Email</span>
          </button>
        </div>

        <p className="auth-footer-link">
          Belum punya akun?{' '}
          <a onClick={() => navigate(SCREENS.SIGNUP)}>Daftar</a>
        </p>
      </div>
    </AuthLayout>
  )
}