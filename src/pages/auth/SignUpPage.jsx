import { createContext, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'
import AuthLayout from '../../components/layout/AuthLayout'

export default function SignUpPage() {
  const { navigate } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name || !email || !password) {
      setErrorMessage('Semua field harus diisi.')
      return
    }

    const result = await registerUser(name, email, password)

    if (result.success) {
      alert('Registrasi berhasil! Silakan masuk dengan akun Anda.')
      navigate(SCREENS.LOGIN)
    } else {
      setErrorMessage(result.message)
    }
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">Daftar</h1>
      <p className="auth-subtitle">
        Buat akun untuk memulai pencatatan stok anda.
      </p>

      <div className="form-group">
        <label className="form-label">Nama</label>
        <input
          className="form-input"
          type="text"
          placeholder="Masukkan nama lengkap Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      </div>

      <button className="btn btn--primary" onClick={() => navigate(SCREENS.HOME)}>
        Daftar
      </button>

      <p className="auth-footer-link">
        Sudah punya akun?{' '}
        <a onClick={() => navigate(SCREENS.LOGIN)}>Masuk</a>
      </p>
    </AuthLayout>
  )
}
