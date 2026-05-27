/* SetPasswordPage.jsx — Create new password */

import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import logoImage from '../../assets/images/icon-set new password.png'

export default function SetPasswordPage() {
  const { navigate } = useApp()
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')

  return (
    <div className="auth-screen">
      <StatusBar variant="dark" />

      <div className="auth-body">
        <div className="otp-icon">
          <img src={logoImage} alt="Set New Password" className="otp-icon__image" />
        </div>

        <h1 className="auth-title">Set New Password</h1>
        <p className="auth-subtitle">
          Enter your new password below to regain access.
        </p>

        <div className="form-group">
          <label className="form-label">Enter New Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          className="btn btn--primary"
          style={{ marginTop: 8 }}
          onClick={() => navigate(SCREENS.HOME)}
        >
          Reset Password
        </button>
      </div>
    </div>
  )
}
