import { useApp }    from '../../context/AppContext'   
import { SCREENS }   from '../../constants'            
import StatusBar     from '../../components/layout/StatusBar'
import googleIcon from '../../assets/images/icon-google.png'
import emailIcon from '../../assets/images/icon-email.png'
import logoImage from '../../assets/images/wastefy-logo.png'

export default function LandingPage() {
  const { navigate } = useApp()

  return (
    <div className="auth-screen">
      {/* <StatusBar variant="dark" /> */}

      <div className="auth-body">
        <div className="auth-hero">
          <div className="auth-logo">
            <img src={logoImage} alt="Wastefy" className="auth-logo__image" />
          </div>
          <p className="auth-tagline">
            Pantau tanggal kadaluwarsa dan kurangi pemborosan makanan.
          </p>
        </div>

        <div className="auth-actions">
          <button className="btn btn--outline" onClick={() => navigate(SCREENS.LOGIN)}>
            Masuk
          </button>
          <button className="btn btn--outline" onClick={() => navigate(SCREENS.SIGNUP)}>
            Daftar
          </button>

          <div className="auth-divider"><span>or</span></div>

          <button className="btn btn--social">
            <img src={googleIcon} alt="Google" className="btn__icon" /> Lanjutkan dengan Google
          </button>
          <button className="btn btn--social">
            <img src={emailIcon} alt="Email" className="btn__icon" /> Lanjutkan dengan Email
          </button>
        </div>
      </div>
    </div>
  )
}
