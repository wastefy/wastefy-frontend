import logoImage from '../../assets/images/wastefy-logo.png'

export default function AuthLayout({ children }) {
    return (
        <div className="auth-screen">

            {/* Panel kiri – branding (tablet/desktop only) */}
            <div className="auth-panel--brand">
                <div className="auth-brand">
                    <img src={logoImage} alt="Wastefy" className="auth-brand__logo" />
                    <p className="auth-brand__tagline">
                        Pantau tanggal kadaluwarsa dan kurangi pemborosan makanan.
                    </p>
                </div>
            </div>

            {/* Panel kanan – form */}
            <div className="auth-panel--form">
                {/* Logo mobile only */}
                <div className="auth-mobile-logo">
                    <img src={logoImage} alt="Wastefy" className="auth-logo__image" />
                </div>

                <div className="auth-body">
                    {children}
                </div>
            </div>

        </div>
    )
}