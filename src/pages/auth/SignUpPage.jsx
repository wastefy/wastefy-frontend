import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import AuthLayout from '../../components/layout/AuthLayout'

export default function SignUpPage() {
  const { navigate, registerUser, authLoading } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSignUpSubmit = async (e) => {
    if (e) e.preventDefault()
    setErrorMessage('')

    if (!name || !email || !password) {
      setErrorMessage('Semua field harus diisi.')
      return
    }

    const result = await registerUser(name, email, password)

    if (result && result.success) {
      alert('Registrasi berhasil! Silakan masuk dengan akun Anda.')
      navigate(SCREENS.LOGIN) // Arahkan ke halaman login setelah daftar sukses
    } else {
      setErrorMessage(result?.message || 'Terjadi kesalahan saat registrasi.')
    }
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">Daftar</h1>
      <p className="auth-subtitle">
        Buat akun untuk memulai pencatatan stok anda.
      </p>

      {/* Tampilkan pesan error jika ada */}
      {errorMessage && (
        <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
          {errorMessage}
        </p>
      )}

      <div className="form-group">
        <label className="form-label">Nama</label>
        <input
          className="form-input"
          type="text"
          placeholder="Masukkan nama lengkap Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={authLoading}
        />
      </div>

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
      </div>

      <button 
        className="btn btn--primary" 
        onClick={handleSignUpSubmit}
        disabled={authLoading}
      >
        {authLoading ? 'Mendaftarkan...' : 'Daftar'}
      </button>

      <p className="auth-footer-link">
        Sudah punya akun?{' '}
        <a onClick={() => navigate(SCREENS.LOGIN)}>Masuk</a>
      </p>
    </AuthLayout>
  )
}