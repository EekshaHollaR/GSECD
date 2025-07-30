module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
      extend: {
        colors: {
          // Custom colors matching the original palette
          'dashboard-blue': '#3B82F6',
          'dashboard-amber': '#F59E0B',
          'dashboard-orange': '#F97316',
          'dashboard-green': '#10B981'
        },
        fontFamily: {
            sans: ["InterVariable", "sans-serif"],
          },
      },
    },
    plugins: [],
  }
  