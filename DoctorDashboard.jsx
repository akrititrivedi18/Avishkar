// DoctorDashboard (M10 module): Doctor is screen par patient ka collected
// data dekhta hai — Registration (M1) aur Complaint (M2) se jo bhi aaya —
// aur use Edit ya Confirm kar sakta hai.
//
// Note: Ye dashboard sirf doctor/staff ke liye hai (patient ke liye nahi),
// isliye ise English me hi rakha hai — Indian hospitals me clinical staff
// aam taur par English hi use karta hai. Agar aage chal kar isko bhi
// multilingual banana ho, to RegistrationForm.jsx jaisa hi TEXT{} pattern
// yaha bhi laga sakte ho.
//
// Aage jaake M6 (Clinical History), M8 (Lab Intelligence) aur M9 (AI
// Summary) modules ka data bhi isi dashboard me apni jagah par aakar
// baith jayega — abhi wo sections "Coming soon" dikhate hain.
//
// Props:
//   patientData -> App.jsx se pura collected data (language, details, complaint)
//   onEdit      -> function() - "Edit" dabane par patient ke registration form par wapas jaana
//   onConfirm   -> function() - "Confirm" dabane par record ko verified mark karna

import { useState } from 'react'

// Wo sections jo abhi backend/AI modules (M6, M8, M9) na hone ki wajah se
// khaali hain — isse dashboard ka poora layout (jaisa SIH doc me diya hai)
// abhi hi dikh jata hai, aur baad me bas real data plug karna hoga.
const COMING_SOON_SECTIONS = [
  'HPI / Clinical History',
  'Past Medical & Surgical History',
  'Medicines & Allergies',
  'Previous Reports',
  'Medical Timeline',
  'AI Clinical Summary',
]

export default function DoctorDashboard({ patientData, onEdit, onConfirm }) {
  // confirmed -> jab doctor "Confirm" dabaye, chhota success message dikhane ke liye
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    setConfirmed(true)
    onConfirm()
  }

  const { details } = patientData

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-900 mb-6 text-center">
        Doctor Dashboard
      </h1>

      {/* --- Patient Information (M1 se aaya data) --- */}
      <section className="bg-white border border-teal-100 rounded-2xl p-6 mb-4">
        <h2 className="font-heading font-semibold text-teal-900 mb-3">Patient Information</h2>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-ink/50">Name</dt>
          <dd className="text-ink">{details?.name || '—'}</dd>

          <dt className="text-ink/50">Age / Gender</dt>
          <dd className="text-ink">{details?.age || '—'} / {details?.gender || '—'}</dd>

          <dt className="text-ink/50">Phone</dt>
          <dd className="text-ink">{details?.phone || '—'}</dd>

          <dt className="text-ink/50">Aadhaar</dt>
          <dd className="text-ink">{details?.aadhaar || '—'}</dd>

          <dt className="text-ink/50">Address</dt>
          <dd className="text-ink">{details?.address || '—'}</dd>
        </dl>
      </section>

      {/* --- Chief Complaint (M2 se aaya data) --- */}
      <section className="bg-white border border-teal-100 rounded-2xl p-6 mb-4">
        <h2 className="font-heading font-semibold text-teal-900 mb-2">Chief Complaint</h2>
        <p className="text-ink/80 text-sm italic">"{patientData.complaint || '—'}"</p>
      </section>

      {/* --- Aage aane wale modules ke liye placeholder sections --- */}
      <section className="bg-white border border-teal-100 rounded-2xl p-6 mb-4">
        <div className="space-y-3">
          {COMING_SOON_SECTIONS.map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-ink/70">{label}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-900/60">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Doctor ki actions: Edit ya Confirm --- */}
      {confirmed ? (
        <p className="text-center text-teal-900 font-heading font-semibold">
          ✓ Record confirmed
        </p>
      ) : (
        <div className="flex gap-3 justify-center">
          <button
            onClick={onEdit}
            className="px-8 py-3 rounded-full font-heading font-semibold border-2 border-teal-900
              text-teal-900 hover:bg-teal-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleConfirm}
            className="px-8 py-3 rounded-full font-heading font-semibold text-white
              bg-teal-900 hover:bg-teal-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  )
}