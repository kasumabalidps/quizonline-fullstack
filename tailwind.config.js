module.exports = {
  // ... konfigurasi lainnya
  theme: {
    extend: {
      // ... extend lainnya
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        }
      },
      skew: {
        '15': '15deg',
      }
    }
  }
} 