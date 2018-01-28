let cachedPrefs;

window.getPrefs = function (callback) {
  if (cachedPrefs) {
    callback(cachedPrefs);
  }
  else {
    chrome.storage.sync.get('prefs', function (result) {
      if (!result) {
        result = {};
      }
      if (!result.prefs) {
        result.prefs = { 
          authpoints: []
        }
      }

      cachedPrefs = result.prefs;
      callback(result.prefs);
    });
  }
};

window.setPrefs = function (prefs) {
  cachedPrefs = prefs;
  chrome.storage.sync.set({
    'prefs': prefs
  });
};

window.clearPrefs = function () {
  cachedPrefs = false;
  chrome.storage.sync.remove('prefs');
};