import { useState, useRef } from 'react'
import axios from 'axios'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import { BASE_URL } from '../../constants'
import otpIcon from '../../assets/images/icon-enter otp.png'

export default function OTPPage() {
  const { navigate } = useApp()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length < 4) {
      setErrorMessage('Masukkan 4 digit kode OTP.')
      return
    }

    const email = localStorage.getItem('resetEmail')
    if (!email) {
      setErrorMessage('Sesi tidak valid. Ulangi dari lupa kata sandi.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')
      await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: otpCode })
      navigate(SCREENS.SET_PASSWORD)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'OTP tidak valid atau sudah kadaluarsa.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    const email = localStorage.getItem('resetEmail')
    if (!email) return
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email })
      setErrorMessage('')
      alert('OTP berhasil dikirim ulang.')
    } catch {
      setErrorMessage('Gagal kirim ulang OTP.')
    }
  }

  return (
    <div className="auth-screen auth-screen--centered">
      <div className="auth-body auth-body--centered">
        <div className="auth-page-icon">
          <img src={otpIcon} alt="OTP" className="auth-page-icon__img" />
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

        <button className="btn btn--primary" onClick={handleVerify} disabled={loading}>
          {loading ? 'Memverifikasi...' : 'Verifikasi Kode'}
        </button>

        <p className="otp-resend">
          Tidak menerima OTP? <a onClick={handleResend}>Kirim Ulang</a>
        </p>
      </div>
    </div>
  )
}
