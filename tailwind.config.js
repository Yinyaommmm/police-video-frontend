/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // theme
        main_background: "#0d1116",
        // icon
        icon: '#ffffff',
        icon_hover: '#72e528',
        // border
        border_nav: '#24282C',
        border_card: '#243139',
        // font
        font_1: '#ffffff'
      },
      backgroundImage: {
        // theme
        card_background: "linear-gradient(196.58deg, rgba(57, 84, 90, 0.6) 2.65%, rgb(23, 27, 33), rgb(25, 36, 44) 90.18%)",
        video_title_background : 'linear-gradient(360deg, #0f1319cc, #0e0e0e00 94.05%)',
        video_time_background : 'linear-gradient(180deg, #0f1319cc, #0e0e0e00 94.05%)',
        button_normal_background: 'linear-gradient(89.86deg,#a7ff1a,#82fac2,#47d4ff)',
        button_hover_background:'linear-gradient(89.86deg,#81d100,#56d69a,#1aaad6)'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
  corePlugins: {
    preflight: false,
  },
}

