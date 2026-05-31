import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import AuthLayout from '../../components/layout/AuthLayout'
import googleIcon from '../../assets/images/icon-google.png'
import emailIcon from '../../assets/images/icon-email.png'

export default function LoginPage() {
  const { navigate } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <AuthLayout>
      <h1 className="auth-title">Masuk</h1>
      <p className="auth-subtitle">
        Masukkan email dan password untuk mengakses dan mengelola layanan Anda.
      </p>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="Masukkan email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        />
        <div className="form-forgot" onClick={() => navigate(SCREENS.FORGOT)}>
          Lupa Kata Sandi?
        </div>
      </div>

      <div className="auth-actions">
        <button className="btn btn--primary" onClick={() => navigate(SCREENS.HOME)}>
          Masuk
        </button>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-social-row">
          <button className="btn btn--social">
            <img src={googleIcon} alt="Google" className="btn__icon" />
            <span>Google</span>
          </button>
          <button className="btn btn--social">
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
