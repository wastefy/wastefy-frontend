/* ================================================
   ForgotPasswordPage.jsx — Request password reset
   ================================================ */
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
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email address to receive a reset link and regain
          access to your account.
        </p>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn--primary"
          style={{ marginTop: 8 }}
          onClick={() => navigate(SCREENS.OTP)}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
