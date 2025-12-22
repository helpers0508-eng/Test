// ⚠️ WARNING: This file contains placeholder API keys for development only!
// 🚫 DO NOT commit real API keys to version control!
// 🔒 Real keys must be stored securely in backend environment variables (.env)
// 📝 This file should be replaced with environment-based configuration in production

const API_CONFIG = {
  google: {
    maps: {
      android: {
        key: 'YOUR_GOOGLE_MAPS_ANDROID_API_KEY',
        secret: 'YOUR_GOOGLE_MAPS_ANDROID_SECRET'
      },
      dataset: {
        oauthClientId: 'YOUR_GOOGLE_DATASET_OAUTH_CLIENT_ID'
      }
    },
    adSense: {
      // Add AdSense configuration here
      publisherId: 'YOUR_ADSENSE_PUBLISHER_ID'
    },
    oauth: {
      // Add OAuth configuration here
      clientId: 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
      clientSecret: 'YOUR_GOOGLE_OAUTH_CLIENT_SECRET'
    }
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}