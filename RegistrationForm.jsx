// RegistrationForm: Patient ki basic details leta hai
// (naam, age, gender, phone, aadhaar, address). Simple validation bhi hai —
// real backend (FastAPI) connect hone par yaha API call add hogi.
//
// Language ke hisaab se labels English/Hindi/Marathi/Bhojpuri me switch hote hain.
//
// Props:
//   language -> selected language code ('en','hi','mr','bho') - labels translate karne ke liye
//   onSubmit -> function(formData) - jab form valid ho aur submit ho

import { useState } from 'react'

// Saare labels/placeholders ek jagah, language ke hisaab se.
// Naya language add karna ho to bas yaha ek naya object jod do.
const TEXT = {
  en: {
    title: 'Your details',
    name: 'Full name',
    namePlaceholder: 'e.g. Ramesh Kumar',
    age: 'Age',
    agePlaceholder: 'e.g. 45',
    gender: 'Gender',
    genderOptions: ['Male', 'Female', 'Other'],
    phone: 'Phone number',
    phonePlaceholder: '10-digit mobile number',
    aadhaar: 'Aadhaar number',
    aadhaarPlaceholder: '12-digit Aadhaar number',
    address: 'Address',
    addressPlaceholder: 'House no., street, city, state',
    continue: 'Continue',
    errorRequired: 'Please fill all the fields.',
    errorPhone: 'Phone number must be 10 digits.',
    errorAadhaar: 'Aadhaar number must be 12 digits.',
  },
  hi: {
    title: 'आपका विवरण',
    name: 'पूरा नाम',
    namePlaceholder: 'जैसे रमेश कुमार',
    age: 'आयु',
    agePlaceholder: 'जैसे 45',
    gender: 'लिंग',
    genderOptions: ['पुरुष', 'महिला', 'अन्य'],
    phone: 'फ़ोन नंबर',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर',
    aadhaar: 'आधार नंबर',
    aadhaarPlaceholder: '12 अंकों का आधार नंबर',
    address: 'पता',
    addressPlaceholder: 'मकान नंबर, गली, शहर, राज्य',
    continue: 'जारी रखें',
    errorRequired: 'कृपया सभी फ़ील्ड भरें।',
    errorPhone: 'फ़ोन नंबर 10 अंकों का होना चाहिए।',
    errorAadhaar: 'आधार नंबर 12 अंकों का होना चाहिए।',
  },
  mr: {
    title: 'तुमचा तपशील',
    name: 'पूर्ण नाव',
    namePlaceholder: 'उदा. रमेश कुमार',
    age: 'वय',
    agePlaceholder: 'उदा. 45',
    gender: 'लिंग',
    genderOptions: ['पुरुष', 'स्त्री', 'इतर'],
    phone: 'फोन नंबर',
    phonePlaceholder: '10 अंकी मोबाइल नंबर',
    aadhaar: 'आधार क्रमांक',
    aadhaarPlaceholder: '12 अंकी आधार क्रमांक',
    address: 'पत्ता',
    addressPlaceholder: 'घर क्रमांक, रस्ता, शहर, राज्य',
    continue: 'पुढे चला',
    errorRequired: 'कृपया सर्व माहिती भरा.',
    errorPhone: 'फोन नंबर 10 अंकी असावा.',
    errorAadhaar: 'आधार क्रमांक 12 अंकी असावा.',
  },
  bho: {
    title: 'रउआ के जानकारी',
    name: 'पूरा नाम',
    namePlaceholder: 'जइसे रमेश कुमार',
    age: 'उमिर',
    agePlaceholder: 'जइसे 45',
    gender: 'लिंग',
    genderOptions: ['मरद', 'मेहरारू', 'अन्य'],
    phone: 'फोन नंबर',
    phonePlaceholder: '10 अंक के मोबाइल नंबर',
    aadhaar: 'आधार नंबर',
    aadhaarPlaceholder: '12 अंक के आधार नंबर',
    address: 'पता',
    addressPlaceholder: 'घर नंबर, गली, शहर, राज्य',
    continue: 'आगे बढ़ीं',
    errorRequired: 'कृपया सब फील्ड भरीं।',
    errorPhone: 'फोन नंबर 10 अंक के होखे के चाहीं।',
    errorAadhaar: 'आधार नंबर 12 अंक के होखे के चाहीं।',
  },
}

export default function RegistrationForm({ language, onSubmit }) {
  // Agar language TEXT me nahi mili, to Hindi par fallback
  const t = TEXT[language] || TEXT.hi

  // Sabhi form fields ek hi object me rakhe hain, isse
  // naya field add karna future me easy rahega.
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    aadhaar: '',
    address: '',
  })

  // error -> agar validation fail ho to yaha message dikhayenge
  const [error, setError] = useState('')

  // Generic change handler - kisi bhi input ke liye reuse hota hai
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault() // page reload rokne ke liye

    // --- Basic validation ---
    // Yaha sabhi required fields ki list hai. Agar future me koi
    // field optional karni ho, to bas isi condition se hatani hogi.
    if (
      !form.name.trim() ||
      !form.age ||
      !form.gender ||
      !form.phone.trim() ||
      !form.aadhaar.trim() ||
      !form.address.trim()
    ) {
      setError(t.errorRequired)
      return
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError(t.errorPhone)
      return
    }
    // Aadhaar number hamesha 12 digit ka hota hai (spaces allowed nahi)
    if (!/^\d{12}$/.test(form.aadhaar)) {
      setError(t.errorAadhaar)
      return
    }

    setError('')

    // TODO (backend integration): yaha FastAPI ke /register endpoint
    // par POST request bhejni hogi, jaise:
    // await fetch('/api/register', { method: 'POST', body: JSON.stringify(form) })
    onSubmit(form)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-900 mb-6 text-center">
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-teal-100 rounded-2xl p-6 space-y-5">
        {/* Naam */}
        <div>
          <label className="block font-body text-sm text-ink/70 mb-1">{t.name}</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder={t.namePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-teal-100 focus:border-teal-700 outline-none"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block font-body text-sm text-ink/70 mb-1">{t.age}</label>
          <input
            type="number"
            value={form.age}
            onChange={handleChange('age')}
            placeholder={t.agePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-teal-100 focus:border-teal-700 outline-none"
          />
        </div>

        {/* Gender - bade touch-friendly options, dropdown ki jagah.
            Note: value hamesha English me store hota hai (Male/Female/Other),
            sirf button ka LABEL translate hota hai — isse backend/data
            consistent rehta hai chahe koi bhi language ho. */}
        <div>
          <label className="block font-body text-sm text-ink/70 mb-1">{t.gender}</label>
          <div className="grid grid-cols-3 gap-2">
            {['Male', 'Female', 'Other'].map((g, index) => (
              <button
                type="button"
                key={g}
                onClick={() => setForm({ ...form, gender: g })}
                className={`py-3 rounded-xl border font-body transition-colors
                  ${form.gender === g
                    ? 'bg-teal-900 text-white border-teal-900'
                    : 'border-teal-100 text-ink/70 hover:border-teal-700'}
                `}
              >
                {t.genderOptions[index]}
              </button>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block font-body text-sm text-ink/70 mb-1">{t.phone}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder={t.phonePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-teal-100 focus:border-teal-700 outline-none"
          />
        </div>

        {/* Aadhaar number */}
        <div>
          <label className="block font-body text-sm text-ink/70 mb-1">{t.aadhaar}</label>
          <input
            type="text"
            inputMode="numeric"       // mobile par number-keyboard khulega
            maxLength={12}
            value={form.aadhaar}
            onChange={handleChange('aadhaar')}
            placeholder={t.aadhaarPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-teal-100 focus:border-teal-700 outline-none"
          />
        </div>

        {/* Address - textarea, kyunki address usually multi-line hota hai */}
        <div>
          <label className="block font-body text-sm text-ink/70 mb-1">{t.address}</label>
          <textarea
            value={form.address}
            onChange={handleChange('address')}
            placeholder={t.addressPlaceholder}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-teal-100 focus:border-teal-700 outline-none resize-none"
          />
        </div>

        {/* Error message */}
        {error && <p className="text-alert text-sm font-body">{error}</p>}

        <button
          type="submit"
          className="w-full py-4 rounded-full font-heading font-semibold text-white
            bg-teal-900 hover:bg-teal-700 transition-colors"
        >
          {t.continue}
        </button>
      </form>
    </div>
  )
}