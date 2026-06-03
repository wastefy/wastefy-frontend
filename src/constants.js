export const BASE_URL = 'https://wastefy-backend-git-dev-wastefy-project-dicoding.vercel.app';

export const SCREENS = {
  LANDING:        'landing',
  LOGIN:          'login',
  LOGIN_EMAIL:    'login_email',
  SIGNUP:         'signup',
  FORGOT:         'forgot',
  OTP:            'otp',
  SET_PASSWORD:   'set_password',
  HOME:           'home',
  NOTIFICATION:   'notification',
  HISTORY:        'history',
  SETTINGS:       'settings',
  NOTIF_SETTINGS: 'notif_settings',
  EDIT_PROFILE:   'edit_profile',
  ITEM_DETAIL:    'item_detail',
}

export const TABS = {
  HOME:         'home',
  NOTIFICATION: 'notification',
  HISTORY:      'history',
}

export const STOCK_STATUS = {
  FRESH:   'fresh',
  SOON:    'soon',
  EXPIRED: 'expired',
}

export const HISTORY_STATUS = {
  USED:   'Terpakai',
  WASTED: 'Dibuang',
}

export const CATEGORIES = [
  'Sayur',
  'Buah',
]

export const FRESH_CATEGORIES = ['Sayur', 'Buah']

export const STORAGE_LOCATIONS = [
  'Pendingin',
  'Pembeku',
  'Suhu Ruang',
]

export const STATUS_LABELS = {
  fresh:   'Segar',
  soon:    'Segera',
  expired: 'Kadaluarsa',
  used:    'Terpakai',
  wasted:  'Dibuang',
}

export const CONDITION_OPTIONS = {
  Sayur: [
    { value: 'Segar',       label: 'Segar',        multiplier: 1.0,  color: '#4CAF50', status: 'fresh'   },
    { value: 'Busuk',       label: 'Busuk',        multiplier: 0,    color: '#F44336', status: 'expired' },
  ],
  Buah: [
    { value: 'Mentah',        label: 'Mentah',         multiplier: 1.5,  color: '#64B5F6', status: 'fresh'   },
    { value: 'Matang',        label: 'Matang',          multiplier: 1.0,  color: '#4CAF50', status: 'fresh'   },
    { value: 'Terlalu Matang',label: 'Terlalu Matang',  multiplier: 0.4,  color: '#FFC107', status: 'soon'    },
    { value: 'Busuk',         label: 'Busuk',           multiplier: 0,    color: '#F44336', status: 'expired' },
  ],
}

export const FRESH_ITEMS = {
  Sayur: ['Wortel', 'Kentang','Tomat', 'Cabai','Mentimun'],
  Buah: ['Pisang', 'Apel', 'Mangga', 'Jeruk', 'Anggur'],
}

export const STORAGE_TIPS = {
  Sayur: 'Simpan di laci sayur kulkas, bungkus dengan kertas atau kain lembab agar tidak cepat layu. Pisahkan dari buah penghasil gas etilen.',
  Buah:    'Simpan di suhu ruang hingga matang, lalu pindahkan ke kulkas. Pisahkan buah matang agar tidak mempercepat pembusukan sekitarnya.',
}