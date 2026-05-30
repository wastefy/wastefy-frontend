import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import StatusBar from '../../components/layout/StatusBar'
import logoImage from '../../assets/images/icon-enter otp.png'

export default function OTPPage() {
  const { navigate } = useApp()
  const [otp, setOtp] = useState(['', '', '', ''])
  const refs = [useRef(), useRef(), useRef(), useRef()]

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 3) refs[index + 1].current?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs[index - 1].current?.focus()
    }
  }

  return (
    <div className="auth-screen">
      {/* <StatusBar variant="dark" /> */}

      <div className="auth-body" style={{ textAlign: 'center' }}>
        <div className="otp-icon">
          <img src={logoImage} alt="Enter OTP" className="otp-icon__image" />
        </div>

        <h1 className="auth-title">Masukkan Kode OTP</h1>
        <p className="auth-subtitle">
          Masukkan 4 kode angka yang telah dikirim ke email terdaftar Anda
        </p>

        <div className="otp-row">
          {otp.map((val, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="otp-box"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <button
          className="btn btn--primary"
          onClick={() => navigate(SCREENS.SET_PASSWORD)}
        >
          Verifikasi Kode
        </button>

        <p className="otp-resend">
          Tidak menerima OTP? <a>Kirim Ulang</a>
        </p>
      </div>
    </div>
  )
}
