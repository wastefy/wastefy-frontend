/* constants.js — App-wide constants */

export const SCREENS = {
  LANDING:        'landing',
  LOGIN:          'login',
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
  FRESH:   'Segar',
  SOON:    'Segera',
  EXPIRED: 'Kadaluarsa',
}

export const HISTORY_STATUS = {
  USED:   'Terpakai',
  WASTED: 'Dibuang',
}

/* Kategori umum — untuk kemasan/olahan */
export const CATEGORIES = [
  'Sayuran',
  'Buah',
]

/* Kategori khusus fresh produce */
export const FRESH_CATEGORIES = ['Sayuran', 'Buah']

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

/* KONDISI FISIK — berbeda per jenis */
export const CONDITION_OPTIONS = {
  Sayuran: [
    { value: 'segar',       label: 'Segar',        multiplier: 1.0,  color: '#4CAF50', status: 'fresh'   },
    { value: 'mulai_layu',  label: 'Mulai Layu',   multiplier: 0.5,  color: '#FFC107', status: 'soon'    },
    { value: 'busuk',       label: 'Busuk',        multiplier: 0,    color: '#F44336', status: 'expired' },
  ],
  Buah: [
    { value: 'mentah',        label: 'Mentah',         multiplier: 1.5,  color: '#64B5F6', status: 'fresh'   },
    { value: 'matang',        label: 'Matang',          multiplier: 1.0,  color: '#4CAF50', status: 'fresh'   },
    { value: 'terlalu_matang',label: 'Terlalu Matang',  multiplier: 0.4,  color: '#FFC107', status: 'soon'    },
    { value: 'busuk',         label: 'Busuk',           multiplier: 0,    color: '#F44336', status: 'expired' },
  ],
}

/* SHELF LIFE BASE — hari simpan dasar per item
   key: nama item lowercase, value: { base, kulkas, suhuRuang } */

export const SHELF_LIFE_BASE = {
  /* Sayuran */
  'wortel':         { base: 14, kulkas: 14, suhuRuang: 7  },
  'kentang':        { base: 14, kulkas: 21, suhuRuang: 14 },
  'tomat':          { base: 5,  kulkas: 10, suhuRuang: 5  },
  'cabai':          { base: 7,  kulkas: 14, suhuRuang: 5  },
  'timun':          { base: 5,  kulkas: 7,  suhuRuang: 3  },
  
  /* Buah */
  'pisang':         { base: 5,  kulkas: 7,  suhuRuang: 5  },
  'apel':           { base: 14, kulkas: 30, suhuRuang: 10 },
  'mangga':         { base: 5,  kulkas: 7,  suhuRuang: 4  },
  'jeruk':          { base: 14, kulkas: 21, suhuRuang: 10 },
  'anggur':         { base: 5,  kulkas: 10, suhuRuang: 3  },
  /* Default fallback */
  'default_sayuran':{ base: 5,  kulkas: 7,  suhuRuang: 3  },
  'default_buah':   { base: 5,  kulkas: 7,  suhuRuang: 3  },
}

/* DAFTAR NAMA FRESH PRODUCE — untuk dropdown */

export const FRESH_ITEMS = {
  Sayuran: [
    'Wortel', 'Kentang','Tomat', 'Cabai','Timun',
  ],
  Buah: [
    'Pisang', 'Apel', 'Mangga', 'Jeruk', 'Anggur',
  ],
}

/* HITUNG ESTIMASI HARI SIMPAN */

export function estimateShelfLife(itemName, condition, location, itemType) {
  const key = itemName?.toLowerCase() ?? ''
  const fallbackKey = itemType === 'Sayuran' ? 'default_sayuran' : 'default_buah'
  const shelf = SHELF_LIFE_BASE[key] ?? SHELF_LIFE_BASE[fallbackKey]

  /* base hari berdasarkan lokasi */
  const isKulkas = location === 'Pendingin' || location === 'Pembeku'
  let baseDays = isKulkas ? shelf.kulkas : shelf.suhuRuang

  /* multiplier kondisi */
  const allConditions = [
    ...CONDITION_OPTIONS.Sayuran,
    ...CONDITION_OPTIONS.Buah,
  ]
  const cond = allConditions.find((c) => c.value === condition)
  const multiplier = cond?.multiplier ?? 1.0

  const days = Math.round(baseDays * multiplier)

  /* pisang di kulkas — edge case */
  if (key === 'pisang' && isKulkas) {
    return { days, note: 'Kulit akan menghitam di kulkas, tapi daging tetap segar.' }
  }

  return { days, note: null }
}

/* PETUNJUK PENYIMPANAN */

export const STORAGE_TIPS = {
  Sayuran: 'Simpan di laci sayur kulkas, bungkus dengan kertas atau kain lembab agar tidak cepat layu. Pisahkan dari buah penghasil gas etilen.',
  Buah:    'Simpan di suhu ruang hingga matang, lalu pindahkan ke kulkas. Pisahkan buah matang agar tidak mempercepat pembusukan sekitarnya.',
}

/* AI PROMPT UNTUK DETEKSI FOTO */

export const AI_DETECT_PROMPT = `Kamu adalah sistem deteksi kondisi buah dan sayuran.
Analisa foto yang diberikan dan kembalikan HANYA JSON berikut tanpa penjelasan apapun:

{
  "type": "Sayuran" atau "Buah",
  "name": "nama spesifik item dalam Bahasa Indonesia",
  "condition": "nilai kondisi sesuai aturan di bawah",
  "confidence": angka 0.0 sampai 1.0
}

ATURAN KONDISI:
- Jika type = "Sayuran": condition hanya boleh "segar", "mulai_layu", atau "busuk"
- Jika type = "Buah": condition hanya boleh "mentah", "matang", "terlalu_matang", atau "busuk"

Jika foto bukan buah atau sayuran, kembalikan:
{ "type": null, "name": null, "condition": null, "confidence": 0 }

Return JSON only.`