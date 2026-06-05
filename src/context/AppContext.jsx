import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'
import { SCREENS, TABS, BASE_URL } from '../constants'
import api from '../utils/axiosInstance'
import {
  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";


const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.LANDING)
  const [prevScreen, setPrevScreen] = useState(null)
  const [activeTab, setActiveTab] = useState(TABS.HOME)
  const [stocks, setStocks] = useState([])
  const [stockFilter, setStockFilter] = useState('all')
  const [history, setHistory] = useState([])
  const [historyFilter, setHistoryFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [notifSetting, setNotifSetting] = useState('allow')
  const [authLoading, setAuthLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(!!localStorage.getItem('token'))

  const navigate = (to) => { setPrevScreen(screen); setScreen(to); sessionStorage.setItem('lastScreen', to) }
  const goBack = () => {
    if (prevScreen) { setScreen(prevScreen); setPrevScreen(null) }
    else setScreen(SCREENS.LANDING)
  }
  const switchTab = (tab) => {
    setActiveTab(tab)
    navigate({ home: SCREENS.HOME, notification: SCREENS.NOTIFICATION, history: SCREENS.HISTORY }[tab])
  }

  const [profile, setProfile] = useState({
    name: 'Your Name', email: 'yourname@gmail.com',
    avatarUrl: null, linkedGoogle: false,
  })

  const loginWithGoogle = async () => {
    try {
      setAuthLoading(true)
      const provider = new GoogleAuthProvider()

      provider.setCustomParameters({
        prompt: 'select_account'
      })

      const userCredential = await signInWithPopup(auth, provider)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('token', token)

      await axios.post(`${BASE_URL}/api/auth/login`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProfile(prev => ({
        ...prev,
        email: userCredential.user.email,
        name: userCredential.user.displayName || prev.name,
        avatarUrl: userCredential.user.photoURL || null,
      }))

      await saveNotificationToken()
      navigate(SCREENS.HOME)
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, message: error.message || 'Gagal masuk dengan Google.' }
    } finally {
      setAuthLoading(false)
    }
  }

  const loginWithEmailLink = async (email) => {
    try {
      setAuthLoading(true)
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      localStorage.setItem('emailForSignIn', email)
      return { success: true, message: 'Link masuk telah dikirim ke email Anda.' }
    } catch (error) {
      console.error('Email link error:', error)
      return { success: false, message: 'Gagal mengirim link. Periksa email Anda.' }
    } finally {
      setAuthLoading(false)
    }
  }
  const saveNotificationToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const firebaseToken = localStorage.getItem("token");

      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (!fcmToken) return;

      await axios.post(
        `${BASE_URL}/api/notifications/token`,
        { token: fcmToken },
        {
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
          },
        }
      );

      console.log("FCM Token saved");
    } catch (err) {
      console.error("FCM Error:", err);
    }
  };

  const deleteNotificationToken = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/api/notifications/token`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Delete token error:', err)
    }
  }

  const checkNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/notifications/check`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Trigger Check Error:", err);
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      setAuthLoading(true);
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        nama: name,
        email,
        password
      });

      if (response.data.success || response.status === 200 || response.status === 201) {
        return { success: true, message: response.data.message || 'Pendaftaran berhasil.' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan pada server saat registrasi.';
      return { success: false, message: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  }

  const loginUser = async (email, password) => {
    try {
      setAuthLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const token = await user.getIdToken()
      localStorage.setItem('token', token)

      setProfile((prev) => ({
        ...prev,
        email: user.email,
        name: user.displayName || prev.name
      }))

      await saveNotificationToken()
      navigate(SCREENS.HOME)
      return { success: true }
    } catch (error) {
      console.error("Firebase Auth Error:", error)
      let errorMessage = error.message || 'Gagal masuk. Periksa kembali jaringan atau kredensial Anda.'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau kata sandi salah.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.'
      }
      return { success: false, message: errorMessage }
    } finally {
      setAuthLoading(false)
    }
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('lastScreen')
    localStorage.removeItem('linkedGoogle')
    localStorage.removeItem('darkMode')
    setProfile({ name: 'Your Name', email: 'yourname@gmail.com', avatarUrl: null, linkedGoogle: false })
    setStocks([])
    setHistory([])
    setNotifications([])
    setScreen(SCREENS.LANDING)
    setPrevScreen(null)

  }

  const [selectedItem, setSelectedItem] = useState(null)
  const updateProfile = (fields) => setProfile((prev) => ({ ...prev, ...fields }))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])


  const openItemDetail = (item) => {
    setSelectedItem(item)
    navigate(SCREENS.ITEM_DETAIL)
  }

  const [inventorySummary, setInventorySummary] = useState(null);

  const mapItem = (raw) => ({
    id: raw.id,
    name: raw.nama_item,
    condition: raw.kondisi_fisik,
    conditionLabel: raw.kondisi_fisik,
    storedIn: raw.lokasi_penyimpanan,
    buyDate: raw.tanggal_beli,
    status: raw.status?.toLowerCase(),
    category: raw.jenis_item ?? raw.kategori ?? raw.category ?? 'Lainnya',
    imageUrl: raw.foto_url ?? raw.imageUrl ?? null,
    shelfDays: raw.sisa_hari ?? raw.shelf_days ?? null,
  })

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks((response.data.items || []).map(mapItem));
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  }

  const fetchInventorySummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/inventory/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventorySummary(response.data);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
    }
  }

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = response.data

      // Cek provider dari Firebase Auth langsung
      const { auth } = await import('../config/firebase')
      const providerIds = auth.currentUser?.providerData?.map(p => p.providerId) || []
      const isGoogleLinked = providerIds.includes('google.com') || localStorage.getItem('linkedGoogle') === 'true'

      setProfile(prev => ({
        ...prev,
        name: user.nama || prev.name,
        email: user.email || prev.email,
        linkedGoogle: isGoogleLinked,
      }))
    } catch (err) {
      console.error('Gagal fetch profile:', err)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setInitLoading(false)
        return
      }

      try {
        await new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe()
            resolve(user)
          })
        })

        const currentUser = auth.currentUser
        if (!currentUser) {
          localStorage.removeItem('token')
          sessionStorage.removeItem('lastScreen')
          setScreen(SCREENS.LANDING)
          return
        }

        const freshToken = await currentUser.getIdToken(true)
        localStorage.setItem('token', freshToken)

        const lastScreen = sessionStorage.getItem('lastScreen')
        const validScreens = [SCREENS.HOME, SCREENS.HISTORY, SCREENS.NOTIFICATION, SCREENS.SETTINGS]
        const screenToGo = validScreens.includes(lastScreen) ? lastScreen : SCREENS.HOME

        setScreen(screenToGo)
        if (screenToGo === SCREENS.HOME) setActiveTab(TABS.HOME)
        else if (screenToGo === SCREENS.HISTORY) setActiveTab(TABS.HISTORY)
        else if (screenToGo === SCREENS.NOTIFICATION) setActiveTab(TABS.NOTIFICATION)
        else setActiveTab(TABS.HOME)

        fetchStocks()
        fetchInventorySummary()
        fetchProfile()
      } catch (error) {
        console.error('Auth init error:', error)
        localStorage.removeItem('token')
        sessionStorage.removeItem('lastScreen')
        setScreen(SCREENS.LANDING)
      } finally {
        setInitLoading(false)
      }
    }

    initAuth()
  }, [])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/inventory/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const raw = response.data.history || response.data.items || []
      setHistory(raw.map(item => ({
        id: item.id ?? item._id,
        name: item.nama_item,
        condition: item.kondisi_fisik,
        conditionLabel: item.kondisi_fisik,
        storedIn: item.lokasi_penyimpanan,
        buyDate: item.tanggal_beli,
        status: item.archiveAction === 'terpakai' ? 'used' : 'wasted',
        imageUrl: item.foto_url ?? null,
        category: item.jenis_item ?? item.kategori ?? 'Lainnya',
        updatedAt: item.updatedAt ?? item.updated_at,
      })))
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/api/notifications/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("NOTIF RESPONSE:", response.data);
      const raw = response.data.history || response.data.notifications || response.data.data || [];

      setNotifications(
        raw.map((n) => ({
          id: n.id ?? n._id,
          title: n.title,
          text: n.body ?? n.text,
          time: n.createdAt
            ? new Date(n.createdAt).toLocaleDateString("id-ID")
            : "Baru saja",
          emoji:
            n.type === "expired"
              ? "🔴"
              : n.type === "soon"
                ? "🟡"
                : "🔔",
          type: n.type,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    if (screen === SCREENS.HOME) {
      fetchStocks();
      fetchInventorySummary();
    }
    if (screen === SCREENS.HISTORY) {
      fetchHistory();
    }
    if (screen === SCREENS.NOTIFICATION) {
      fetchNotifications();
    }
  }, [screen]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Hanya berjalan jika user sudah terautentikasi (mempunyai token)
    if (token) {
      // Ambil daftar riwayat notifikasi awal
      fetchNotifications();

      // Perintahkan backend mengecek masa kedaluwarsa item saat ini
      checkNotification();

      // Pasang listener FCM real-time (aplikasi dalam kondisi terbuka)
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Notification received in foreground:", payload);
        // Otomatis refresh list notifikasi di tempat tanpa reload halaman
        fetchNotifications();
      });

      return () => unsubscribe();
    }
  }, []);

  const addStock = async (item) => {
    try {
      const token = localStorage.getItem('token');

      const tempItem = {
        id: 'temp-' + Date.now(),
        name: item.name,
        category: item.category,
        condition: item.condition,
        conditionLabel: item.condition,
        storedIn: item.storedIn,
        buyDate: item.buyDate,
        status: 'fresh',
        imageUrl: null,
      }
      setStocks(prev => [tempItem, ...prev])
      setAddModalOpen(false)
      setSuccessModalOpen(true)

      await axios.post(`${BASE_URL}/api/inventory`, {
        nama_item: item.name,
        jenis_item: item.category,
        kondisi_fisik: item.condition,
        lokasi_penyimpanan: item.storedIn,
        tanggal_beli: item.buyDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      await Promise.all([fetchStocks(), checkNotification()])

    } catch (error) {
      console.error('Error menambahkan stok:', error)
      setStocks(prev => prev.filter(s => !s.id.toString().startsWith('temp-')))
      alert('Gagal menambahkan item. Silakan coba lagi.')
    }
  }

  const markUsed = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BASE_URL}/api/inventory/${id}/used`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStocks();
      fetchHistory();
    } catch (error) {
      alert('Gagal menandai item sebagai terpakai. Silakan coba lagi.')
    }
  }

  const throwAway = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BASE_URL}/api/inventory/${id}/wasted`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStocks();
      fetchHistory();
    } catch (error) {
      alert('Gagal menandai item sebagai dibuang. Silakan coba lagi.')
    }
  }

  const addBackToStock = async (histId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`${BASE_URL}/api/inventory/${histId}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchStocks()
      await fetchHistory()
    } catch (error) {
      alert('Gagal mengembalikan item ke stok. Silakan coba lagi.')
    }
  }

  const value = {
    screen, navigate, goBack,
    activeTab, switchTab,
    stocks, stockFilter, setStockFilter, addStock, markUsed, throwAway,
    history, historyFilter, setHistoryFilter, addBackToStock,
    notifications,
    addModalOpen, setAddModalOpen,
    successModalOpen, setSuccessModalOpen,
    darkMode, setDarkMode,
    notifSetting, setNotifSetting,
    profile, updateProfile,
    selectedItem, openItemDetail,
    setStocks,
    registerUser,
    loginUser, loginWithGoogle, loginWithEmailLink,
    authLoading, initLoading,
    fetchHistory, fetchNotifications,
    logoutUser,
    saveNotificationToken,
    deleteNotificationToken,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}