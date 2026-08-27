// LanguageSelect: Patient sabse pehle apni language chunta hai.
// Bade touch-friendly cards diye hain (kiosk touchscreen ke liye)
// taaki elderly/low-literacy patients ko bhi tap karna easy lage.
//
// Props:
//   onSelect -> function(languageCode) - jab patient language choose kare

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bho', label: 'भोजपुरी' }, // aap yaha aur languages add kar sakte ho
  { code: 'mr', label: 'मराठी' },
]

export default function LanguageSelect({ onSelect }) {
  return (
    <div className="text-center">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-900 mb-2">
        Select your language
      </h1>
      <p className="text-ink/60 mb-8">अपनी भाषा चुनें</p>

      {/* Grid of language cards - 2 columns mobile, 4 columns bade screen par */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="bg-white border-2 border-teal-100 rounded-2xl py-8 px-4
              font-heading text-lg font-semibold text-teal-900
              hover:border-teal-700 hover:bg-teal-100/50 active:scale-95
              transition-all shadow-sm"
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
