import { createContext, useContext, useState, useEffect } from 'react'
import { SCREENS, TABS } from '../constants'

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
  const [profile, setProfile] = useState({
    name: 'Your Name', email: 'yourname@gmail.com',
    avatarUrl: null, linkedGoogle: false,
  })
  const [selectedItem, setSelectedItem] = useState(null)

  const updateProfile = (fields) => setProfile((prev) => ({ ...prev, ...fields }))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const navigate = (to) => { setPrevScreen(screen); setScreen(to) }
  const goBack = () => {
    if (prevScreen) { setScreen(prevScreen); setPrevScreen(null) }
    else setScreen(SCREENS.LANDING)
  }
  const switchTab = (tab) => {
    setActiveTab(tab)
    navigate({ home: SCREENS.HOME, notification: SCREENS.NOTIFICATION, history: SCREENS.HISTORY }[tab])
  }

  const openItemDetail = (item) => {
    setSelectedItem(item)
    navigate(SCREENS.ITEM_DETAIL)
  }

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

  const markUsed = (id) => {
    const item = stocks.find((s) => s.id === id)
    if (!item) return
    setHistory((prev) => [{ ...item, id: Date.now(), status: 'used', date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }, ...prev])
    setStocks((prev) => prev.filter((s) => s.id !== id))
  }

  const throwAway = (id) => {
    const item = stocks.find((s) => s.id === id)
    if (!item) return
    setHistory((prev) => [{ ...item, id: Date.now(), status: 'wasted', isExpired: item.status === 'expired', date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }, ...prev])
    setStocks((prev) => prev.filter((s) => s.id !== id))
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
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}