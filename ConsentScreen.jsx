// ConsentScreen: Patient ko batata hai ki unka data kaise use hoga,
// aur "I Agree" checkbox tick kiye bina aage nahi badh sakte.
// Yeh clinical safety + privacy requirement hai (SIH doc me mentioned).
//
// Props:
//   language -> selected language code ('en','hi','mr','bho') - text switch karne ke liye
//   onAgree  -> function() - jab patient agree karke "Continue" dabaye

import { useState } from 'react'

// Saara text ek hi jagah, language ke hisaab se.
// Naya language add karna ho to bas yaha ek naya object jod do.
const TEXT = {
  en: {
    title: 'Consent to continue',
    body: `MediKiosk will collect your medical history, symptoms, and any
    documents you scan, to help your doctor understand your case faster.
    Your data is stored securely and shared only with your treating
    doctor and hospital records (with your consent).`,
    checkboxLabel: 'I agree to share my information for treatment purposes',
    button: 'Agree & Continue',
  },
  hi: {
    title: 'सहमति दें',
    body: `मेडिकियोस्क आपकी मेडिकल हिस्ट्री, लक्षण और स्कैन किए गए दस्तावेज़ एकत्र करेगा,
    ताकि डॉक्टर आपकी स्थिति जल्दी समझ सकें। आपका डेटा सुरक्षित रूप से रखा जाएगा
    और केवल आपके डॉक्टर व अस्पताल के रिकॉर्ड के साथ (आपकी सहमति से) साझा किया जाएगा।`,
    checkboxLabel: 'मैं इलाज के लिए अपनी जानकारी साझा करने के लिए सहमत हूँ',
    button: 'सहमत हूँ, आगे बढ़ें',
  },
  mr: {
    title: 'संमती द्या',
    body: `मेडिकियोस्क तुमचा वैद्यकीय इतिहास, लक्षणे आणि स्कॅन केलेली कागदपत्रे
    गोळा करेल, जेणेकरून डॉक्टरांना तुमची स्थिती लवकर समजेल. तुमचा डेटा
    सुरक्षितपणे साठवला जाईल आणि फक्त तुमच्या डॉक्टर व रुग्णालयाच्या
    नोंदींसोबत (तुमच्या संमतीने) शेअर केला जाईल.`,
    checkboxLabel: 'मी उपचारासाठी माझी माहिती शेअर करण्यास संमती देतो',
    button: 'संमत आहे, पुढे चला',
  },
  bho: {
    title: 'सहमति दीं',
    body: `मेडिकियोस्क रउआ के मेडिकल हिस्ट्री, लच्छन आ स्कैन कइल दस्तावेज
    जमा करी, जेहसे डॉक्टर रउआ के हालत जल्दी बूझ सकस। रउआ के डेटा सुरक्षित
    राखल जाई आ खाली रउआ के डॉक्टर आ अस्पताल के रिकॉर्ड में (रउआ के
    सहमति से) साझा कइल जाई।`,
    checkboxLabel: 'हम इलाज खातिर आपन जानकारी साझा करे खातिर सहमत बानी',
    button: 'सहमत बानी, आगे बढ़ीं',
  },
}

export default function ConsentScreen({ language, onAgree }) {
  // checked -> track karta hai ki checkbox tick hai ya nahi
  const [checked, setChecked] = useState(false)

  // Agar language TEXT me nahi mili (kabhi na ho), to Hindi par fallback
  const t = TEXT[language] || TEXT.hi

  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-900 mb-6">
        {t.title}
      </h1>

      {/* Consent text card */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 text-left text-ink/80 leading-relaxed mb-6">
        {t.body}
      </div>

      {/* Checkbox - bina tick kiye Continue button disabled rahega */}
      <label className="flex items-center justify-center gap-3 mb-8 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="w-6 h-6 accent-teal-700"
        />
        <span className="font-body text-ink">{t.checkboxLabel}</span>
      </label>

      <button
        onClick={onAgree}
        disabled={!checked}
        className="w-full sm:w-auto px-10 py-4 rounded-full font-heading font-semibold text-white
          bg-teal-900 hover:bg-teal-700 transition-colors
          disabled:bg-ink/20 disabled:cursor-not-allowed"
      >
        {t.button}
      </button>
    </div>
  )
}