# API Key Setup Instructions

## Google Maps API Key Configuration

For security, the Google Maps API key is stored in a gitignored configuration file.

### Setup Steps:

1. **Copy the example config file:**
   ```bash
   cp scripts/config.example.js scripts/config.js
   ```

2. **Edit `scripts/config.js` and add your API key:**
   ```javascript
   window.GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

3. **Verify `.gitignore` includes:**
   ```
   scripts/config.js
   ```

### Important Security Notes:

- ✅ `scripts/config.js` is gitignored and will NOT be committed
- ✅ `scripts/config.example.js` is committed as a template (no real key)
- ✅ Never commit your actual API key to version control
- ✅ Restrict your API key in Google Cloud Console to specific domains/IPs
- ✅ Use API key restrictions (HTTP referrers) for web applications

### Google Cloud Console Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Create or edit your API key
4. Set Application restrictions to "HTTP referrers"
5. Add your domain(s) to the allowed referrers list
6. Set API restrictions to only allow:
   - Maps JavaScript API
   - Places API
   - Geocoding API

This ensures your API key is secure and only works on your authorized domains.

