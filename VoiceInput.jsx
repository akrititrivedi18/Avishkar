// VoiceInput (M2 module): Patient apni "chief complaint" (kya problem hai)
// bata sakta hai — ya to mic dabakar BOL kar, ya niche text box me TYPE karke.
//
// Mic ka behavior: EK TAP = start listening, DOBARA TAP = stop listening.
// Beech me agar browser khud thoda ruk jaye (silence ki wajah se), to hum
// use khud-ba-khud restart kar dete hain jab tak patient khud "stop" na
// dabaye — isse patient ko lagta hai mic tab tak chalta hai jab tak wo
// khud band na kare.
//
// Voice recognition ke liye browser ka built-in "Web Speech API" use kiya
// hai — koi extra paid API key nahi chahiye. Best support Chrome/Edge me milta hai.
//
// Props:
//   language -> selected language code ('en','hi','mr','bho') - mic + labels dono ke liye
//   onSubmit -> function(complaintText) - jab patient "Continue" dabaye

import { useState, useRef, useEffect } from 'react'

// Humare app ke language-code ko browser ke speech-recognition
// language-code (BCP-47) se map karte hain.
// Note: Bhojpuri (bho) ka apna speech-recognition code abhi kisi browser
// me nahi hai, isliye uske liye sabse-paas wali Hindi recognition use
// karte hain — patient jo bhi bolega wo Hindi script me hi likha jayega.
const SPEECH_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bho: 'hi-IN',
}

// Saara UI text ek jagah, language ke hisaab se.
const TEXT = {
  en: {
    title: 'What brings you here today?',
    subtitle: 'Speak or type your main problem',
    tapToSpeak: 'Tap the mic to speak',
    listening: 'Listening… tap again to stop',
    notSupported: 'Voice input is not supported on this browser — please type below.',
    placeholder: 'e.g. I have had fever and headache for 3 days',
    continue: 'Continue',
    errorPermission: 'Microphone access was denied. Please allow microphone permission for this site and try again.',
    errorGeneric: 'Something went wrong with the microphone. Please try again or type your answer.',
  },
  hi: {
    title: 'आज आप यहाँ किस लिए आए हैं?',
    subtitle: 'अपनी मुख्य समस्या बोलें या टाइप करें',
    tapToSpeak: 'बोलने के लिए माइक दबाएँ',
    listening: 'सुन रहे हैं… रोकने के लिए दोबारा दबाएँ',
    notSupported: 'इस ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है — कृपया नीचे टाइप करें।',
    placeholder: 'जैसे मुझे 3 दिन से बुखार और सिरदर्द है',
    continue: 'जारी रखें',
    errorPermission: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया इस साइट के लिए माइक्रोफ़ोन अनुमति दें और फिर से कोशिश करें।',
    errorGeneric: 'माइक्रोफ़ोन में कुछ गड़बड़ी हुई। कृपया फिर से कोशिश करें या नीचे टाइप करें।',
  },
  mr: {
    title: 'आज तुम्ही इथे कशासाठी आला आहात?',
    subtitle: 'तुमची मुख्य समस्या बोला किंवा टाइप करा',
    tapToSpeak: 'बोलण्यासाठी माइक दाबा',
    listening: 'ऐकत आहे… थांबवण्यासाठी पुन्हा दाबा',
    notSupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट सपोर्ट नाही — कृपया खाली टाइप करा.',
    placeholder: 'उदा. मला 3 दिवसांपासून ताप आणि डोकेदुखी आहे',
    continue: 'पुढे चला',
    errorPermission: 'मायक्रोफोनला परवानगी मिळाली नाही. कृपया या साइटसाठी मायक्रोफोन परवानगी द्या आणि पुन्हा प्रयत्न करा.',
    errorGeneric: 'मायक्रोफोनमध्ये काहीतरी बिघाड झाला. कृपया पुन्हा प्रयत्न करा किंवा खाली टाइप करा.',
  },
  bho: {
    title: 'आज रउआ इहाँ काहे खातिर आइल बानी?',
    subtitle: 'आपन मुख्य समस्या बोलीं या टाइप करीं',
    tapToSpeak: 'बोले खातिर माइक दबाईं',
    listening: 'सुनल जा रहल बा… रोके खातिर फेर दबाईं',
    notSupported: 'ई ब्राउज़र में वॉइस इनपुट सपोर्ट नइखे — कृपया नीचे टाइप करीं।',
    placeholder: 'जइसे हमरा 3 दिन से बुखार आ सिरदर्द बा',
    continue: 'आगे बढ़ीं',
    errorPermission: 'माइक्रोफोन के अनुमति नइखे मिलल। कृपया ई साइट खातिर माइक्रोफोन अनुमति दीं आ फेर कोशिश करीं।',
    errorGeneric: 'माइक्रोफोन में कुछ गड़बड़ भइल। कृपया फेर कोशिश करीं या नीचे टाइप करीं।',
  },
}

export default function VoiceInput({ language, onSubmit }) {
  // Agar language TEXT me nahi mili, to Hindi par fallback
  const t = TEXT[language] || TEXT.hi

  // complaint -> text box me jo bhi text hai (bola gaya ya type kiya gaya)
  const [complaint, setComplaint] = useState('')

  // isListening -> UI dikhane ke liye (button ka look badalne ke liye)
  const [isListening, setIsListening] = useState(false)

  // micError -> agar mic me koi problem aaye (permission, etc.) to yaha message
  const [micError, setMicError] = useState('')

  // agar browser voice input support hi nahi karta
  const [voiceSupported, setVoiceSupported] = useState(true)

  // recognitionRef -> SpeechRecognition instance (re-render ke beech yaad rehta hai)
  const recognitionRef = useRef(null)

  // shouldListenRef -> patient ki "intention" yaad rakhta hai: usne khud
  // stop dabaya hai ya nahi. Isi se decide hota hai ki agar browser khud
  // beech me ruk jaye, to hum use dobara start karein ya nahi.
  const shouldListenRef = useRef(false)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      // Is browser me voice support nahi hai — patient neeche type kar sakta hai.
      setVoiceSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LANG_MAP[language] || 'hi-IN'
    recognition.continuous = true      // patient ke khud stop karne tak chalta rahe
    recognition.interimResults = false

    // Jab bhi koi final result aaye, use text box me jod do
    recognition.onresult = (event) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' '
        }
      }
      if (finalText.trim()) {
        setComplaint((prev) => (prev ? prev + ' ' + finalText.trim() : finalText.trim()))
      }
    }

    // Recognition khud ruk gaya (browser ki wajah se) —
    // agar patient ne khud stop nahi dabaya, to dobara start kar do.
    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start()
        } catch {
          setIsListening(false)
        }
      } else {
        setIsListening(false)
      }
    }

    // Error aane par sahi message dikhao
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        // Patient ne mic permission nahi di — dobara try karna faayda nahi
        shouldListenRef.current = false
        setIsListening(false)
        setMicError(t.errorPermission)
      } else if (event.error === 'no-speech') {
        // Kuch bola nahi gaya abhi — onend khud restart kar dega, error mat dikhao
      } else {
        shouldListenRef.current = false
        setIsListening(false)
        setMicError(t.errorGeneric)
      }
    }

    recognitionRef.current = recognition

    // Cleanup: component hatte waqt recognition poori tarah band kar do
    return () => {
      shouldListenRef.current = false
      recognition.stop()
    }
  }, [language])

  // Mic button dabane par yeh chalta hai — EK TAP start, DOBARA TAP stop
  const toggleListening = () => {
    if (!recognitionRef.current) return
    setMicError('')

    if (isListening) {
      // Patient khud stop kar raha hai
      shouldListenRef.current = false
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      shouldListenRef.current = true
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        // Agar pehle se koi instance chal raha ho to yaha error aa sakta hai — ignore karo
      }
    }
  }

  const handleContinue = () => {
    if (!complaint.trim()) return
    onSubmit(complaint.trim())
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-900 mb-2">
        {t.title}
      </h1>
      <p className="text-ink/60 mb-8">{t.subtitle}</p>

      {/* Mic button - "listening" hote waqt pulse effect */}
      {voiceSupported && (
        <button
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6
            transition-all
            ${isListening ? 'bg-alert animate-pulse' : 'bg-teal-900 hover:bg-teal-700'}
          `}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
          🎤
        </button>
      )}
      {voiceSupported && (
        <p className="text-xs text-ink/50 mb-2">
          {isListening ? t.listening : t.tapToSpeak}
        </p>
      )}

      {/* Mic se related error (permission, etc.) */}
      {micError && <p className="text-alert text-xs mb-4">{micError}</p>}

      {/* Agar browser voice support na kare, to sirf yeh message dikhega */}
      {!voiceSupported && (
        <p className="text-xs text-ink/50 mb-4">{t.notSupported}</p>
      )}

      {/* Touch/type fallback - hamesha available rehta hai */}
      <textarea
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={t.placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-teal-100 focus:border-teal-700 outline-none resize-none text-left mb-6"
      />

      <button
        onClick={handleContinue}
        disabled={!complaint.trim()}
        className="w-full sm:w-auto px-10 py-4 rounded-full font-heading font-semibold text-white
          bg-teal-900 hover:bg-teal-700 transition-colors
          disabled:bg-ink/20 disabled:cursor-not-allowed"
      >
        {t.continue}
      </button>
    </div>
  )
}