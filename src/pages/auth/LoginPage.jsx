import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import googleIcon from '../../assets/images/icon-google.png'
import emailIcon from '../../assets/images/icon-email.png'

export default function LoginPage() {
  const { navigate } = useApp()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="auth-screen">
      {/* <StatusBar variant="dark" /> */}

      <div className="auth-body">
        <h1 className="auth-title">Masuk</h1>
        <p className="auth-subtitle">
          Masukkan email dan password untuk mengakses dan mengelola layanan Anda.
        </p>

        {/* Email */}
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

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Kata Sandi</label>
          <input
            className="form-input"
            type="password"
            placeholder="Masukkan kata sandi Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="form-forgot"
            onClick={() => navigate(SCREENS.FORGOT)}
          >
            Lupa Kata Sandi?
          </div>
        </div>

        <div className="auth-actions">
          <button
            className="btn btn--primary"
            style={{ marginTop: 8 }}
          onClick={() => navigate(SCREENS.HOME)}
          >
          Masuk
          </button>

          <button className="btn btn--social">
            <img src={googleIcon} alt="Google" className="btn__icon" />
            <span>Lanjutkan dengan Google</span>
          </button>
        
          <button className="btn btn--social">
            <img src={emailIcon} alt="Email" className="btn__icon" /> 
            <span>Lanjutkan dengan Email</span>
          </button>

          <p className="auth-footer-link">
            Belum punya akun?{' '}
          <a onClick={() => navigate(SCREENS.SIGNUP)}>Daftar</a>
          </p>
        </div>

      </div>
    </div>
  )
}
