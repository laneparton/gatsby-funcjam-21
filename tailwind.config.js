module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'discord-bg-primary': '#36393f',
        'discord-bg-secondary': '#2f3136',
        'discord-bg-tertiary': '#202225',
        'discord-text-muted': '#72767d',
        'discord-header-secondary': '#b9bbbe',
        'discord-blurple': '#5865F2',
      },
      fontFamily: {
        'primary': '"Helvetica Neue",Helvetica,Arial,sans-serif'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
