export default defineNuxtConfig({
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '@/assets/styles.css'
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-url': {},
      'postcss-preset-env': {
        stage: 2,
        features: {
          'custom-properties': false
        }
      }
    }
  },

  modules: [],

  compatibilityDate: '2025-03-02'
});