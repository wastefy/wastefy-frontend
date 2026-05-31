import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import setPasswordIcon from '../../assets/images/icon-set new password.png'

export default function SetPasswordPage() {
  const { navigate } = useApp()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

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

        <div className="form-group">
          <label className="form-label">Kata Sandi Baru</label>
          <input
            className="form-input"
            type="password"
            placeholder="Masukkan kata sandi baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          />
        </div>

        <button className="btn btn--primary" onClick={() => navigate(SCREENS.HOME)}>
          Atur Ulang Kata Sandi
        </button>
      </div>
    </div>
  )
}
