// API Configuration Example
// Copy this file to config.js and add your actual API key
// DO NOT commit config.js to version control

window.GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// Load Google Maps with the API key from config
(function() {
  const script = document.getElementById('maps-script');
  if (script && window.GOOGLE_MAPS_API_KEY) {
    script.src = script.src.replace('API_KEY_PLACEHOLDER', window.GOOGLE_MAPS_API_KEY);
  }
})();

