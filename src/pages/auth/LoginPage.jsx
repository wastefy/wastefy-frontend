import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import AuthLayout from '../../components/layout/AuthLayout'
import googleIcon from '../../assets/images/icon-google.png'
import emailIcon from '../../assets/images/icon-email.png'

export default function LoginPage() {
    const { navigate, loginUser, loginWithGoogle, loginWithEmailLink, authLoading } = useApp()
  const [email, setEmail] = useState('')
  const [emailLinkInput, setEmailLinkInput] = useState('')
  const [emailLinkSent, setEmailLinkSent] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle()
    if (result.success) navigate(SCREENS.HOME)
    else setErrorMessage(result.message)
  }

  const handleEmailLink = async () => {
    const emailInput = prompt('Masukkan email Anda untuk menerima link masuk:')
    if (!emailInput) return
    const result = await loginWithEmailLink(emailInput)
    if (result.success) alert(result.message)
    else setErrorMessage(result.message)
  }

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.')
      return
    }

    const result = await loginUser(email, password)

    if (result && result.success) {
      navigate(SCREENS.HOME)
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
        <button 
          className="btn btn--primary" 
          onClick={handleLoginSubmit}
          disabled={authLoading}
        >
          {authLoading ? 'Memproses...' : 'Masuk'}
        </button>

        <div className="auth-divider"><span>or</span></div>

      <div className="auth-social-row">
          <button className="btn btn--social" onClick={handleGoogleLogin} disabled={authLoading}>
            <img src={googleIcon} alt="Google" className="btn__icon" />
            <span>Google</span>
          </button>
          <button className="btn btn--social" onClick={() => navigate(SCREENS.LOGIN_EMAIL)} disabled={authLoading}>
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