import axios from 'axios'
import { BASE_URL } from '../../constants'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import StatusBar from '../../components/layout/StatusBar'
import BottomNav from '../../components/layout/BottomNav'
import { IconArrowLeft } from '../../components/common/Icons'
import emailIcon from '../../assets/images/icon-email.png'

function getInitials(name = '') {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function EditProfilePage() {
  const { goBack, profile, updateProfile } = useApp()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [linkedGoogle, setLinkedGoogle] = useState(profile.linkedGoogle)

  const initials = getInitials(name) || '?'

  const handleSave = async () => {
    try {
      const { auth } = await import('../../config/firebase')
      const freshToken = await auth.currentUser?.getIdToken(true)
      const token = freshToken || localStorage.getItem('token')

      await axios.put(`${BASE_URL}/api/auth/profile`, {
        nama: name.trim() || profile.name,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      updateProfile({
        name: name.trim() || profile.name,
        email: email.trim() || profile.email,
        avatarUrl: null,
        linkedGoogle,
      })
      goBack()
    } catch (error) {
      console.log('Status:', error.response?.status)
      console.log('Message:', error.response?.data)
      alert('Gagal menyimpan profil. Silakan coba lagi.')
    }
  }

  const handleLinkGoogle = async () => {
    if (linkedGoogle) return

    try {
      const { auth } = await import('../../config/firebase')
      const { GoogleAuthProvider, linkWithPopup } = await import('firebase/auth')

      const provider = new GoogleAuthProvider()
      await linkWithPopup(auth.currentUser, provider)

      setLinkedGoogle(true)
      localStorage.setItem('linkedGoogle', 'true')
      alert('Akun Google berhasil dihubungkan!')
    } catch (error) {
      if (error.code === 'auth/provider-already-linked' ||
        error.code === 'auth/credential-already-in-use') {
        setLinkedGoogle(true)
        localStorage.setItem('linkedGoogle', 'true')
      } else {
        alert('Gagal menghubungkan Google. Coba lagi.')
      }
    }
  }
  return (
    <div className="app-screen">
      {/* <StatusBar variant="light" /> */}

      <div className="app-header">
        <div className="app-header__back-row">
          <button className="app-header__icon-btn" onClick={goBack} aria-label="Go back">
            <IconArrowLeft />
          </button>
          <h1 className="app-header__title">Edit Profil</h1>
        </div>
      </div>

      <div className="app-content" style={{ padding: '0 16px 110px' }}>

        <div className="edit-profile-avatar-wrap">
          <div className="edit-profile-avatar">
            <span className="edit-profile-avatar__initials">{initials}</span>
          </div>
        </div>

        <div className="edit-profile-section">
          <div className="edit-profile-field">
            <label className="edit-profile-field__label">Nama</label>
            <input
              className="edit-profile-field__input"
              type="text"
              value={name}
              placeholder="Masukkan nama anda"
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="edit-profile-field">
            <label className="edit-profile-field__label">Email</label>
            <input
              className="edit-profile-field__input"
              type="email"
              value={email}
              placeholder="Masukkan email anda"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <p className="section-label" style={{ marginTop: 'var(--sp-4)' }}>Akun yang Terhubung</p>
        <div className="edit-profile-section">

          <div className="linked-account-row">
            <div className="linked-account-row__left">
              <svg width="22" height="22" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.706C3.784 10.166 3.682 9.59 3.682 9s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <div>
                <div className="linked-account-row__name">Google</div>
                {linkedGoogle && (
                  <div className="linked-account-row__email">{email}</div>
                )}
              </div>
            </div>
            <span
              className={`linked-badge linked-badge--${linkedGoogle ? 'linked' : 'unlinked'}`}
              onClick={() => setLinkedGoogle(v => !v)}
            >
              {linkedGoogle ? 'Terhubung' : 'Hubungkan'}
            </span>
          </div>

          <div className="linked-account-row" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="linked-account-row__left">
              <img
                src={emailIcon}
                alt="Email"
                width={22}
                height={22}
                style={{ borderRadius: 4, objectFit: 'contain', flexShrink: 0 }}
              />
              <div>
                <div className="linked-account-row__name">Email</div>
                <div className="linked-account-row__email">{email}</div>
              </div>
            </div>
            <span className="linked-badge linked-badge--linked">Terhubung</span>
          </div>

        </div>

        <button
          className="btn btn--primary"
          style={{ marginTop: 'var(--sp-4)' }}
          onClick={handleSave}
        >
          Simpan Perubahan
        </button>
      </div>

      <BottomNav />
    </div>
  )
}