let cachedPrefs;

window.getPrefs = function () {
  return new Promise(resolve => {
    if(!cachedPrefs) {
      chrome.storage.sync.get('prefs', result => {
        if (!result) {
          result = {};
        }
        if (!result.prefs) {
          result.prefs = { 
            headerPrefix: 'Bearer',
            authpoints: []
          }
        }
  
        cachedPrefs = result.prefs;
        resolve({ ...cachedPrefs });
      });
    }
    else {
      resolve({ ...cachedPrefs });
    }
  });
};

window.getHeaderPrefix = function () {
  return window.getPrefs()
    .then(prefs => prefs.headerPrefix);
};

window.getPageAuthpoint = function (pageUrl) {
  return window.getPrefs()
    .then(prefs => prefs.authpoints
      .find(x => new RegExp(x.page).test(pageUrl))
    );
};

window.setPrefs = function (prefs) {
  cachedPrefs = prefs;
  chrome.storage.sync.set({
    'prefs': prefs
  });
};

window.setHeaderPrefix = function (newPrefix) {
  cachedPrefs.headerPrefix = newPrefix;
  window.setPrefs(cachedPrefs);
};

window.setPageAuthpoint = function (pageUrl, auth) {
  let existing = cachedPrefs.authpoints
    .find(x => new RegExp(x.page).test(pageUrl));
  
  if (!existing) {
    cachedPrefs.authpoints.push({ page: pageUrl });
    existing = cachedPrefs.authpoints[cachedPrefs.authpoints.length - 1];
  }

  if (!auth || !auth.trim()) {
    cachedPrefs.authpoints.splice(cachedPrefs.authpoints.indexOf(existing), 1);
  }

  existing.auth = auth;
  window.setPrefs(cachedPrefs);
};

window.clearPrefs = function () {
  cachedPrefs = false;
  chrome.storage.sync.remove('prefs');
};