/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../node_modules/flowbite-react/**/*.js", "./app/**/*.{html,jsx,tsx}", "../../lib/ui/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        'calendar': 'calc(288px - 28px)',
      }
    },
  },
  plugins: [],
}

