// StepIndicator: Patient ko dikhata hai ki wo flow me kaha hai
// (Language -> Consent -> Register -> Done). Isko "signature element"
// ki tarah design kiya hai — connected path jaisa, kisi kiosk machine
// ke physical button flow jaisa.
//
// Props:
//   currentStep -> number (0,1,2,3) - abhi kaunsa step active hai
//   steps       -> array of strings - step ke labels

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((label, index) => {
        const isDone = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={label} className="flex items-center">
            {/* Ek step ka circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
                  font-heading font-semibold text-sm sm:text-base transition-colors
                  ${isDone ? 'bg-teal-700 text-white' : ''}
                  ${isActive ? 'bg-teal-900 text-white ring-4 ring-teal-100' : ''}
                  ${!isDone && !isActive ? 'bg-teal-100 text-teal-900' : ''}
                `}
              >
                {/* Done ho chuke step par tick dikhao, warna number */}
                {isDone ? '✓' : index + 1}
              </div>
              <span className="mt-1 text-xs sm:text-sm text-ink/70 font-body">
                {label}
              </span>
            </div>

            {/* Do steps ke beech connecting line (last step ke baad nahi chahiye) */}
            {index < steps.length - 1 && (
              <div
                className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 mb-5
                  ${isDone ? 'bg-teal-700' : 'bg-teal-100'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
