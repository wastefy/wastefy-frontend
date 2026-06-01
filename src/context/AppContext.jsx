import { createContext, useContext, useState, useEffect } from 'react'
import { SCREENS, TABS, BASE_URL } from '../constants'
import axios from 'axios'
import api from '../utils/axiosInstance'
import { signInWithEmailAndPassword } from 'firebase/auth' // getAuth dibersihkan dari sini
import { auth } from '../config/firebase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [screen, setScreen]           = useState(SCREENS.LANDING)
  const [prevScreen, setPrevScreen]   = useState(null)
  const [activeTab, setActiveTab]     = useState(TABS.HOME)
  const [stocks, setStocks]           = useState([])
  const [stockFilter, setStockFilter] = useState('all')
  const [history, setHistory]             = useState([])
  const [historyFilter, setHistoryFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [addModalOpen, setAddModalOpen]         = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [darkMode, setDarkMode]         = useState(false)
  const [notifSetting, setNotifSetting] = useState('allow')
  const [authLoading, setAuthLoading] = useState(false)
  
  const navigate = (to) => { setPrevScreen(screen); setScreen(to) }
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

  const registerUser = async (name, email, password) => {
    try {
      setAuthLoading(true);
      const response = await api.patch('/api/auth/register', {
        name, 
        email,
        password
      });
      
      if (response.data.success) {
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

      return { success: true, user }
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

  const [selectedItem, setSelectedItem] = useState(null)
  const updateProfile = (fields) => setProfile((prev) => ({ ...prev, ...fields }))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const openItemDetail = (item) => {
    setSelectedItem(item)
    navigate(SCREENS.ITEM_DETAIL)
  }

  const [inventorySummary, setInventorySummary] = useState(null);

  const mapItem = (raw) => ({
    id:             raw.id,
    name:           raw.nama_item,
    condition:      raw.kondisi_fisik,
    conditionLabel: raw.kondisi_fisik,
    storedIn:       raw.lokasi_penyimpanan,
    buyDate:        raw.tanggal_beli,
    status:         raw.status?.toLowerCase(),   
    category:       raw.jenis_item ??raw.kategori ?? raw.category ?? 'Lainnya',
    imageUrl:       raw.foto_url ?? raw.imageUrl ?? null,
    shelfDays:      raw.sisa_hari ?? raw.shelf_days ?? null,
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

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/inventory/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const raw = response.data.history || response.data.items || []
      setHistory(raw.map(item => ({
        id:             item.id ?? item._id,
        name:           item.nama_item,
        condition:      item.kondisi_fisik,
        conditionLabel: item.kondisi_fisik,
        storedIn:       item.lokasi_penyimpanan,
        buyDate:        item.tanggal_beli,
        status:         item.action === 'terpakai' ? 'used' : 'wasted',
        imageUrl:       item.foto_url ?? null,
        category:       item.jenis_item ?? item.kategori ?? 'Lainnya',
        updatedAt:      item.updatedAt ?? item.updated_at,
      })))
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/notification/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const raw = response.data.notifications || response.data || []
      setNotifications(raw.map(n => ({
        id:    n.id ?? n._id,
        title: n.title ?? n.judul,
        text:  n.body  ?? n.pesan ?? n.text,
        time:  n.createdAt ? new Date(n.createdAt).toLocaleDateString('id-ID') : 'Baru saja',
        emoji: n.type === 'expired' ? '🔴' : n.type === 'soon' ? '🟡' : '✅',
        type:  n.type,
      })))
    } catch (error) {
      console.error('Error fetching notifications:', error)
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

  const addStock = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/inventory`, {
        nama_item:          item.name,
        kondisi_fisik:      item.condition,
        lokasi_penyimpanan: item.storedIn,
        tanggal_beli:       item.buyDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchStocks();

      setNotifications((prev) => [{
        id: Date.now() + 1,
        title: `${item.name} berhasil ditambahkan!`,
        text: `Pantau kondisi ${item.name} agar tidak terbuang.`,
        time: 'Baru saja', emoji: '✅', type: 'info',
      }, ...prev]);

      setAddModalOpen(false)
      setSuccessModalOpen(true)
    } catch (error) {
      console.error('Error menambahkan stok:', error)
    }
  }

  const markUsed = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BASE_URL}/api/inventory/${id}/used`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStocks();
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
    } catch (error) {
      alert('Gagal menandai item sebagai dibuang. Silakan coba lagi.')
    }
  }

  const addBackToStock = (histId) => {
    const item = history.find((h) => h.id === histId)
    if (!item) return
    setStocks((prev) => [{ ...item, id: Date.now(), status: 'fresh' }, ...prev])
    setHistory((prev) => prev.filter((h) => h.id !== histId))
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
    loginUser, 
    authLoading,
    fetchHistory, fetchNotifications,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}