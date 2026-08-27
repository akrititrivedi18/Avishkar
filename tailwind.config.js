// Tailwind config — yaha hum apna "design system" define karte hain:
// colors, fonts, etc. Agar kabhi color change karna ho, to sirf yaha
// value badlo — poore app me automatically change ho jayega.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical teal — trust aur calm ke liye primary color
        teal: {
          900: '#0E5C56',
          700: '#14807A',
          100: '#E3F3F1',
        },
        // Marigold accent — Indian OPD context, sirf CTA/highlight ke liye
        marigold: '#E08A1E',
        ink: '#1B2B2A',      // main text color
        paper: '#F7F9F8',    // background color
        alert: '#D64545',    // red-flag / error ke liye (future use)
      },
      fontFamily: {
        // Heading font — thoda friendly aur rounded
        heading: ['Poppins', 'Noto Sans Devanagari', 'sans-serif'],
        // Body font — high legibility, elderly/low-literacy users ke liye best
        body: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
