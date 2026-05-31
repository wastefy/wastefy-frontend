import { createContext, useContext, useState, useEffect } from 'react'
import { SCREENS, TABS, BASE_URL } from '../constants'
import axios from 'axios'

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

  const registerUser = async (nama, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        nama,     
        email,
        password
      });
      
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.' 
      };
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

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(response.data);
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

  useEffect(() => {
    if (screen === SCREENS.HOME) {
      fetchStocks();
      fetchInventorySummary();
    }
  }, [screen]);

  const addStock = (item) => {
    const newItem = {
      id:        Date.now(),
      name:      item.name,
      category:  item.category,    
      itemType:  item.itemType,    
      quantity:  item.quantity ?? '',
      storedIn:  item.storedIn ?? '',
      inputDate: new Date().toLocaleDateString('id-ID'),
      imageUrl:  item.imageUrl ?? null,
      emoji:     item.emoji ?? '🥗',

      condition:       item.condition ?? null,      
      estimatedExpiry: item.estimatedExpiry ?? null,
      shelfDays:       item.shelfDays ?? null,      
      aiConfidence:    item.aiConfidence ?? null,

      expiryDate:      item.expiryDate ?? null, 

      status: item.status ?? 'fresh',
    }

    setStocks((prev) => [newItem, ...prev])
    setAddModalOpen(false)
    setSuccessModalOpen(true)

    setNotifications((prev) => [{
      id: Date.now() + 1,
      title: `${item.name} berhasil ditambahkan!`,
      text: `Pantau kondisi ${item.name} agar tidak terbuang.`,
      time: 'Baru saja', emoji: '✅', type: 'info',
    }, ...prev])
  }

  const markUsed = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/inventory/${id}/used`, {}, {
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
      await axios.post(`${BASE_URL}/api/inventory/${id}/wasted`, {}, {
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
    authLoading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}