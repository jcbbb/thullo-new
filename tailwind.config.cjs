module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      maxWidth: {
        "12xl": "120rem",
      },
      minHeight: {
        header: "calc(100vh - 88px)",
      },
      colors: {
        brand: {
          50: "#F1F6FE",
          100: "#E3EEFD",
          200: "#C2DAFA",
          300: "#9CC3F6",
          400: "#6DA7F2",
          500: "#2F80ED",
          600: "#1471EB",
          700: "#1161CA",
          800: "#0F52A9",
          900: "#0A3671",
        },
      },
      keyframes: {
        bounceIn: {
          "0%": { opacty: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "dialog-reveal": {
          "0%": { opacty: "0", transform: "translateY(30px)" },
          "100%": { opacty: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        bounceIn: "bounceIn 300ms ease",
        "dialog-reveal": "dialog-reveal 200ms ease",
      },
    },
    fontFamily: {
      sans: ["Roboto"],
    },
  },

  plugins: [],
};
