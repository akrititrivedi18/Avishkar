# MediKiosk Frontend (M1: Registration + Language + Consent)

## Run kaise kare
1. Node.js install hona chahiye (v18+): https://nodejs.org
2. Terminal me is folder ke andar jao:
   `cd medikiosk-frontend`
3. Dependencies install karo:
   `npm install`
4. Dev server start karo:
   `npm run dev`
5. Terminal me diya gaya link (jaise `http://localhost:5173`) browser me kholo.

## Folder structure
- `src/App.jsx` — poore flow ka controller (kaunsi screen dikhani hai)
- `src/components/LanguageSelect.jsx` — language chunne ki screen
- `src/components/ConsentScreen.jsx` — consent lene ki screen
- `src/components/RegistrationForm.jsx` — patient details form
- `src/components/StepIndicator.jsx` — upar wala progress indicator
- `tailwind.config.js` — colors/fonts yaha se change karo

## Next steps (M2 aur M10 ke liye)
- M2 (Voice input): `LanguageSelect` ke baad ek mic button screen add karo,
  jo Bhashini/AI4Bharat API ko call kare.
- M10 (Doctor Dashboard): ek naya route/page banao jaha doctor
  patient ka AI-generated summary dekh sake (alag app ho sakta hai).
