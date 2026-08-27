// App.jsx — Yeh poore M1 module (Registration + Language + Consent) ka
// "controller" hai. Isme ek simple state (`step`) rakha hai jo batata hai
// ki patient abhi flow ke kis screen par hai. Har screen apna kaam karke
// wapas App.jsx ko batati hai ki "aage badho" (via onSelect/onAgree/onSubmit).
//
// Flow: Language (0) -> Consent (1) -> Registration (2) -> Complaint/Voice (3) -> Done (4)
//
// Aage jaake yaha M10 (doctor dashboard) bhi isi tarah naye
// "step" ya alag route ke roop me jud sakta hai.

import { useState } from 'react'
import StepIndicator from './components/StepIndicator.jsx'
import LanguageSelect from './components/LanguageSelect.jsx'
import ConsentScreen from './components/ConsentScreen.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import VoiceInput from './components/VoiceInput.jsx'
import DoctorDashboard from './components/DoctorDashboard.jsx'

// Step-indicator ke labels, language ke hisaab se.
// Naya language add karna ho to bas yaha ek naya array jod do.
const STEP_LABELS = {
  en: ['Language', 'Consent', 'Register', 'Complaint', 'Done'],
  hi: ['भाषा', 'सहमति', 'पंजीकरण', 'शिकायत', 'पूर्ण'],
  mr: ['भाषा', 'संमती', 'नोंदणी', 'तक्रार', 'पूर्ण'],
  bho: ['भाषा', 'सहमति', 'पंजीकरण', 'शिकायत', 'पूरा'],
}

// Sabse aakhri "Done" screen ka text, language ke hisaab se.
const DONE_TEXT = {
  en: { title: 'Registration complete', welcome: 'Welcome,', recorded: 'Your complaint has been recorded:' },
  hi: { title: 'पंजीकरण पूर्ण हुआ', welcome: 'स्वागत है,', recorded: 'आपकी शिकायत दर्ज कर ली गई है:' },
  mr: { title: 'नोंदणी पूर्ण झाली', welcome: 'स्वागत आहे,', recorded: 'तुमची तक्रार नोंदवली गेली आहे:' },
  bho: { title: 'पंजीकरण पूरा भइल', welcome: 'स्वागत बा,', recorded: 'रउआ के शिकायत दर्ज क लिहल गइल बा:' },
}

// "Back" button ka label, language ke hisaab se
const BACK_LABEL = { en: '← Back', hi: '← वापस', mr: '← मागे', bho: '← पाछू' }

export default function App() {
  // view: 'patient' -> normal patient flow, 'doctor' -> M10 dashboard
  const [view, setView] = useState('patient')

  // step: 0,1,2,3,4 — abhi kaunsi screen dikhani hai
  const [step, setStep] = useState(0)

  // Patient ka pura data ek hi jagah collect karte hain.
  // Isse baad me backend ko bhejna easy hoga.
  const [patientData, setPatientData] = useState({
    language: 'en',
    consentGiven: false,
    details: null,
    complaint: '',   // M2: patient ne voice/type se jo problem batayi
  })

  // Chuni gayi language ke labels/text (agar language list me na ho to Hindi par fallback)
  const stepLabels = STEP_LABELS[patientData.language] || STEP_LABELS.hi
  const doneText = DONE_TEXT[patientData.language] || DONE_TEXT.hi

  // Ek step peeche jaane ke liye — data delete nahi hota, sirf screen badalti hai
  const handleBack = () => setStep(step - 1)

  // --- Step 0: Language chuni gayi ---
  const handleLanguageSelect = (langCode) => {
    setPatientData({ ...patientData, language: langCode })
    setStep(1)
  }

  // --- Step 1: Consent diya gaya ---
  const handleConsentAgree = () => {
    setPatientData({ ...patientData, consentGiven: true })
    setStep(2)
  }

  // --- Step 2: Registration form submit hua ---
  const handleRegistrationSubmit = (formData) => {
    setPatientData({ ...patientData, details: formData })
    setStep(3)
  }

  // --- Step 3: Voice/Touch se complaint batayi gayi (M2) ---
  const handleComplaintSubmit = (complaintText) => {
    setPatientData({ ...patientData, complaint: complaintText })
    setStep(4)

    // TODO: yaha poora patientData FastAPI backend ko bhej sakte ho
    // console.log('Final patient data:', { ...patientData, complaint: complaintText })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="font-heading text-xl font-bold text-teal-900">MediKiosk</h2>
        <p className="text-xs text-ink/50 tracking-wide">
          AI-Powered Clinical History Assistant
        </p>
      </div>

      {/* --- M10: Doctor Dashboard view --- */}
      {view === 'doctor' && (
        <DoctorDashboard
          patientData={patientData}
          onEdit={() => {
            setView('patient')
            setStep(2) // seedhe registration form par le jao, edit karne ke liye
          }}
          onConfirm={() => {}}
        />
      )}

      {/* --- Patient-facing flow (M1 + M2) --- */}
      {view === 'patient' && (
        <>
          {/* Back button - Language screen (0) aur Done screen (4) par nahi dikhana */}
          {step > 0 && step < 4 && (
            <button
              onClick={handleBack}
              className="self-start ml-2 sm:ml-0 mb-2 text-sm text-teal-900/70 hover:text-teal-900 font-body"
            >
              {BACK_LABEL[patientData.language] || BACK_LABEL.hi}
            </button>
          )}

          {/* Progress indicator - "Done" step par nahi dikhana (khud hi last hai) */}
          {step < 4 && <StepIndicator currentStep={step} steps={stepLabels} />}

          {/* Current screen ke hisaab se sahi component dikhao */}
          <div className="w-full">
            {step === 0 && <LanguageSelect onSelect={handleLanguageSelect} />}

            {step === 1 && (
              <ConsentScreen language={patientData.language} onAgree={handleConsentAgree} />
            )}

            {step === 2 && (
              <RegistrationForm language={patientData.language} onSubmit={handleRegistrationSubmit} />
            )}

            {step === 3 && (
              <VoiceInput language={patientData.language} onSubmit={handleComplaintSubmit} />
            )}

            {step === 4 && (
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-teal-900 text-white flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h1 className="font-heading text-2xl font-semibold text-teal-900 mb-2">
                  {doneText.title}
                </h1>
                <p className="text-ink/60 mb-6">
                  {doneText.welcome} {patientData.details?.name}. {doneText.recorded}{' '}
                  <span className="italic">"{patientData.complaint}"</span>
                </p>

                {/* Demo ke liye: doctor-side dashboard yahi se khol sakte ho */}
                <button
                  onClick={() => setView('doctor')}
                  className="text-sm text-teal-900 underline underline-offset-2"
                >
                  Open Doctor Dashboard →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}