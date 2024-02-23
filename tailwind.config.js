/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],

  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#FF751A",
          secondary: "#E65B00",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#FF751A",
          secondary: "#E65B00",
        },
      },
    ],
  },
    

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      backgroundColor: {
        'dark': '#1d232a',
        'light': '#ffffff',
      },
      textColor: {
        'dark': '#ffffff',
        'light': '#000000',
      },
      boxShadow: {
        normal: '4.0px 8.0px 8.0px rgba(0,0,0,0.38)'
      },
    },
  },

  plugins: [forms, require("daisyui")],
}
