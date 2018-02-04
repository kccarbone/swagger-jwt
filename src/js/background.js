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
            fieldSelector: '#Auth',
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

window.getFieldSelector = function () {
  return window.getPrefs()
    .then(prefs => prefs.fieldSelector);
};

window.getPageAuthpoint = function (pageUrl) {
  return window.getPrefs()
    .then(prefs => prefs.authpoints.findPage(pageUrl));
};

window.setPrefs = function (prefs) {
  return new Promise(resolve => {
    cachedPrefs = prefs;
    chrome.storage.sync.set({
      'prefs': prefs
    }, resolve);
  });
};

window.setHeaderPrefix = function (newPrefix) {
  cachedPrefs.headerPrefix = newPrefix;
  return window.setPrefs(cachedPrefs);
};

window.setFieldSelector = function (newSelector) {
  cachedPrefs.fieldSelector = newSelector;
  return window.setPrefs(cachedPrefs);
};

window.setPageAuthpoint = function (pageUrl, auth) {
  if (!auth || !auth.trim()) {
    return window.removePageAuthpoint(pageUrl);
  }

  let existing = cachedPrefs.authpoints.findPage(pageUrl);

  if (!existing) {
    cachedPrefs.authpoints.push({ page: pageUrl });
    existing = cachedPrefs.authpoints[cachedPrefs.authpoints.length - 1];
  }

  existing.auth = auth;
  return window.setPrefs(cachedPrefs);
};

window.removePageAuthpoint = function (pageUrl) {
  const pageRecord = cachedPrefs.authpoints.findPage(pageUrl);

  if (pageRecord) {
    cachedPrefs.authpoints.splice(cachedPrefs.authpoints.indexOf(pageRecord), 1);
  }

  return window.setPrefs(cachedPrefs);
};

window.clearPrefs = function () {
  cachedPrefs = false;
  chrome.storage.sync.remove('prefs');
};

Array.prototype.findPage = function (pageUrl) {
  const match = x => new RegExp(`^${x.replace(/\*/g, '.*')}$`);

  return this.find(x => match(x.page).test(pageUrl));
};