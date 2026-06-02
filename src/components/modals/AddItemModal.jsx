import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef, useCallback, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import api from "../../utils/axiosInstance";
import {
  FRESH_ITEMS,
  CONDITION_OPTIONS,
  STORAGE_LOCATIONS,
} from "../../constants";

const TODAY = new Date().toISOString().split("T")[0];

function daysToStatus(days) {
  if (days <= 0) return "expired";
  if (days <= 2) return "soon";
  return "fresh";
}

function calcExpiryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function guessCategory(name) {
  if (!name) return "";
  const lower = name.toLowerCase();
  const allItems = Object.entries(FRESH_ITEMS);
  for (const [cat, items] of allItems) {
    if (items.some((i) => i.toLowerCase() === lower)) return cat;
  }
  return "";
}

const BLANK = {
  name: "",
  category: "",
  condition: "",
  storedIn: "Pendingin",
  buyDate: TODAY,
  quantity: "",
  imageUrl: null,
  imageFile: null,
};

export default function AddItemModal() {
  const {
    setAddModalOpen,
    addStock,
    fetchStocks = () => {},
    setSuccessModalOpen = () => {},
  } = useApp();

  const [form, setForm] = useState(BLANK);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const [aiState, setAiState] = useState("idle"); // idle|loading|done|error|not_produce
  const [aiResult, setAiResult] = useState(null);
  const [showRottenConfirm, setRotten] = useState(false);
  const photoRef = useRef(null);
  const [scanQuota, setScanQuota] = useState(null); // { used, limit, remaining }

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await api.get("/api/inventory/scan-quota");
        setScanQuota(res.data);
      } catch (err) {
        console.error("Gagal fetch scan quota:", err);
      }
    };
    fetchQuota();
  }, []);

  const conditionOptions = form.category
    ? (CONDITION_OPTIONS[form.category] ?? [])
    : [];

  const allItems = [
    ...(FRESH_ITEMS?.Sayur
      ? FRESH_ITEMS.Sayur.map((n) => ({ name: n, cat: "Sayur" }))
      : []),
    ...(FRESH_ITEMS?.Buah
      ? FRESH_ITEMS.Buah.map((n) => ({ name: n, cat: "Buah" }))
      : []),
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Estimasi dari sisa_hari yang dikembalikan API
  const estimation = aiResult?.sisa_hari
    ? { days: aiResult.sisa_hari, note: aiResult.cara_simpan || null }
    : null;

  const handleNameChange = (name) => {
    const cat = guessCategory(name);
    setForm((p) => ({ ...p, name, category: cat, condition: "" }));
  };

  const handlePhotoForAI = useCallback(
    async (file) => {
      if (!file) return;

      if (
        scanQuota !== null &&
        scanQuota.remaining !== undefined &&
        scanQuota.remaining <= 0
      ) {
        alert(
          `Kuota scan AI habis (${scanQuota.used}/${scanQuota.limit}). Tambah item manual.`,
        );
        return;
      }

      set("imageUrl", URL.createObjectURL(file));
      set("imageFile", file);
      setAiState("loading");
      setAiResult(null);

      try {
        const formData = new FormData();
        formData.append("file_foto", file);

        const response = await api.post("/api/inventory/scan", formData);
        const result = response.data;

        // Cek apakah out of scope (bukan buah/sayur)
        if (result.out_of_scope || !result.data) {
          setAiState("not_produce");
          return;
        }

        const data = result.data; // ambil dari result.data

        setAiResult(data);
        setAiState("done");

        let detectedCategory = data.jenis_item;
        if (detectedCategory === "Sayuran") detectedCategory = "Sayur";

        setForm((p) => ({
          ...p,
          name: data.nama_item ?? p.name,
          category: detectedCategory ?? p.category,
          condition: data.kondisi_fisik ?? p.condition,
        }));
      } catch (err) {
        console.error("Error saat melakukan scan gambar:", err);
        setAiState("error");
      }
    },
    [scanQuota],
  );

  const clearPhoto = () => {
    setForm((p) => ({
      ...p,
      imageUrl: null,
      imageFile: null,
      name: "",
      category: "",
      condition: "",
    }));
    setAiState("idle");
    setAiResult(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.condition) {
      alert("Mohon lengkapi data item terlebih dahulu.");
      return;
    }

    if (form.condition.toLowerCase() === "busuk") {
      setRotten(true);
      return;
    }

    await executeSubmit();
  };

  const executeSubmit = async () => {
    try {
      const dataPayload = {
        nama_item: form.name,
        jenis_item: form.category,
        kondisi_fisik: form.condition,
        lokasi_penyimpanan: form.storedIn,
        tanggal_beli: form.buyDate,
      };

      const response = await api.post("/api/inventory", dataPayload);

      if (response.status === 200 || response.status === 201) {
        if (typeof fetchStocks === "function") fetchStocks();

        doAddStock();

        setAddModalOpen(false);
        if (typeof setSuccessModalOpen === "function") {
          setSuccessModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error submit inventory:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Terjadi kesalahan jaringan saat menambahkan item.";
      alert(`Gagal menambahkan item: ${errorMsg}`);
    }
  };

  const doAddStock = () => {
    const condObj = conditionOptions.find((c) => c.value === form.condition);
    const est = estimation ?? { days: 3, note: null };
    if (typeof addStock === "function") {
      addStock({
        name: form.name,
        category: form.category,
        itemType: "fresh",
        quantity: form.quantity || 1,
        storedIn: form.storedIn,
        buyDate: form.buyDate,
        imageUrl: form.imageUrl,
        condition: form.condition,
        conditionLabel: condObj?.label ?? form.condition,
        estimatedExpiry: calcExpiryDate(est.days),
        shelfDays: est.days,
        aiConfidence: null,
        status: daysToStatus(est.days),
      });
    }
  };

  if (showRottenConfirm)
    return (
      <div className="modal-overlay" onClick={() => setRotten(false)}>
        <div
          className="modal-sheet anim-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ textAlign: "center", padding: "var(--sp-4) 0" }}>
            <div style={{ fontSize: 48, marginBottom: "var(--sp-4)" }}>⚠️</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-md)",
                marginBottom: "var(--sp-2)",
                color: "var(--color-text-dark)",
              }}
            >
              Item terdeteksi busuk
            </h3>
            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--color-text-gray)",
                lineHeight: 1.6,
                marginBottom: "var(--sp-6)",
              }}
            >
              Kondisi item ini sudah tidak layak konsumsi. Tetap tambahkan ke
              stok?
            </p>
            <div style={{ display: "flex", gap: "var(--sp-3)" }}>
              <button
                className="btn btn--outline"
                style={{ flex: 1 }}
                onClick={() => setRotten(false)}
              >
                Batal
              </button>
              <button
                className="btn btn--primary"
                style={{ flex: 1, background: "var(--color-btn-throw)" }}
                onClick={() => {
                  setRotten(false);
                  executeSubmit();
                }}
              >
                Tetap Tambah
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
      <div
        className="modal-sheet anim-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-drag-handle" />

        <div className="modal-header">
          <div className="modal-header__title">Tambah Item</div>
          <button
            className="modal-header__close"
            onClick={() => setAddModalOpen(false)}
          >
            ✕
          </button>
        </div>

        {!form.imageUrl ? (
          <div
            className="add-photo-zone"
            onClick={() => photoRef.current?.click()}
          >
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handlePhotoForAI(e.target.files?.[0])}
            />
            <div className="add-photo-zone__icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p className="add-photo-zone__title">
              Foto buah/sayur{" "}
              <span
                style={{ fontWeight: 400, color: "var(--color-text-muted)" }}
              >
                (opsional)
              </span>
            </p>
            <p className="add-photo-zone__sub">
              Jika diupload, nama &amp; kondisi terisi otomatis oleh AI
            </p>
            {scanQuota && (
              <p
                style={{
                  fontSize: "var(--fs-xs)",
                  color:
                    scanQuota.remaining <= 2
                      ? "var(--color-warn, #e07b00)"
                      : "var(--color-text-muted)",
                  marginTop: 4,
                }}
              >
                Kuota scan: {scanQuota.remaining}/{scanQuota.limit} tersisa
              </p>
            )}
          </div>
        ) : (
          <div className="add-photo-preview">
            <img
              src={form.imageUrl}
              alt="preview"
              className="add-photo-preview__img"
            />
            <div className="add-photo-preview__overlay">
              <button
                className="add-photo-preview__change"
                onClick={clearPhoto}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2" />
                </svg>
                Hapus
              </button>
            </div>

            {aiState === "loading" && (
              <div className="add-ai-banner add-ai-banner--loading">
                <div className="add-spinner" />
                <span>AI sedang menganalisa foto...</span>
              </div>
            )}
            {aiState === "done" && aiResult && (
              <div className="add-ai-banner add-ai-banner--done">
                <div style={{ flex: 1 }}>
                  <strong>{aiResult.nama_item}</strong> · {form.category} ·{" "}
                  Kondisi <strong>{aiResult.kondisi_fisik}</strong>
                </div>
              </div>
            )}
            {aiState === "error" && (
              <div className="add-ai-banner add-ai-banner--warn">
                <span>Gagal menganalisa foto. Isi form manual.</span>
              </div>
            )}
            {aiState === "not_produce" && (
              <div className="add-ai-banner add-ai-banner--warn">
                <span>Foto bukan buah/sayur. Isi form manual.</span>
              </div>
            )}
          </div>
        )}

        {!form.imageUrl && (
          <div className="add-hint-box">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Tanpa foto? Isi nama dan kondisi secara langsung.
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
            marginTop: "var(--sp-3)",
          }}
        >
          {/* Nama item */}
          <div className="modal-form-group">
            <label className="modal-label">Nama item</label>
            <select
              className="modal-select"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            >
              <option value="">
                {aiState === "loading"
                  ? "AI sedang mendeteksi..."
                  : "Pilih atau tunggu deteksi AI"}
              </option>
              {allItems.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Jenis item */}
            {form.category && (
              <div
                style={{
                  marginTop: "var(--sp-1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "var(--fs-xs)",
                  color: "var(--color-text-muted)",
                }}
              >
                <span>
                  Jenis:{" "}
                  <strong style={{ color: "var(--color-text-dark)" }}>
                    {form.category}
                  </strong>
                </span>
                {aiState === "done" && (
                  <span></span>
                )}
              </div>
            )}
          </div>

          {/* Kondisi fisik */}
          <div className="modal-form-group">
            <label className="modal-label">Kondisi fisik</label>
            <select
              className="modal-select"
              value={form.condition}
              disabled={!form.category}
              onChange={(e) => set("condition", e.target.value)}
              style={{ opacity: form.category ? 1 : 0.45 }}
            >
              <option value="">
                {!form.category
                  ? "Pilih nama item dahulu"
                  : aiState === "loading"
                    ? "AI sedang mendeteksi..."
                    : "Pilih kondisi"}
              </option>
              {conditionOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {form.condition && aiState === "done" && (
              <div
                style={{
                  marginTop: "var(--sp-1)",
                  fontSize: "var(--fs-xs)",
                  color: "var(--color-text-muted)",
                }}
              >
                Dapat diubah jika tidak sesuai
              </div>
            )}
          </div>

          {/* Lokasi simpan */}
          <div className="modal-form-group">
            <label className="modal-label">Lokasi simpan</label>
            <select
              className="modal-select"
              value={form.storedIn}
              onChange={(e) => set("storedIn", e.target.value)}
            >
              {STORAGE_LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal beli */}
          <div className="modal-form-group">
            <label className="modal-label">
              Tanggal beli
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--color-text-muted)",
                  marginLeft: 4,
                }}
              >
                (default: hari ini)
              </span>
            </label>
            <DatePicker
              className="modal-input"
              wrapperClassName="date-picker-wrapper"
              selected={form.buyDate ? new Date(form.buyDate) : null}
              maxDate={new Date()}
              dateFormat="yyyy/MM/dd"
              onChange={(date) => {
                const formattedDate = date
                  ? date.toISOString().split("T")[0]
                  : "";
                set("buyDate", formattedDate);
              }}
              customInput={<input className="modal-input" type="text" />}
            />
          </div>

          {/* Submit */}
          <button
            className="btn btn--primary"
            disabled={!form.name || !form.category || !form.condition}
            style={{
              opacity:
                !form.name || !form.category || !form.condition ? 0.5 : 1,
            }}
            onClick={handleSubmit}
          >
            Tambah stok
          </button>
        </div>
      </div>
    </div>
  );
}
