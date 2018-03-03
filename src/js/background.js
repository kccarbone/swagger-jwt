// In-memory cache of stored preferences
let cachedPrefs;
let bootstrapped = [];

// Public methods
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
            fieldSelector: 'input[name=Authorization]',
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
  return window.setPrefs(cachedPrefs)
    .then(() => window.refreshTabs(pageUrl, true));
};

window.removePageAuthpoint = function (pageUrl) {
  const pageRecord = cachedPrefs.authpoints.findPage(pageUrl);

  if (pageRecord) {
    cachedPrefs.authpoints.splice(cachedPrefs.authpoints.indexOf(pageRecord), 1);
  }

  return window.setPrefs(cachedPrefs)
    .then(() => window.refreshTabs(pageUrl));
};

window.clearPrefs = function () {
  cachedPrefs = false;
  chrome.storage.sync.remove('prefs');
};

// Re-bootstrap affected tabs when pref changes
window.refreshTabs = function (pageUrl, createNew) {
  return new Promise(resolve => {
    chrome.tabs.query({}, resolve);
  })
  .then(tabs => {
    const regex = new RegExp(`^${pageUrl.replace(/\*/g, '.*')}$`);

    if (createNew) {
      tabs.filter(x => regex.test(x.url))
        .forEach(x => bootstrapTab(x.id));
    }
    else {
      tabs.filter(x => regex.test(x.url))
        .forEach(x => chrome.tabs.reload(x.id));
    }
  });
};

window.injectScript = function (tabId, file) {
  return new Promise(resolve => {
    chrome.tabs.executeScript(tabId, { file }, resolve);
  });
};

window.injectStyles = function (tabId, file) {
  return new Promise(resolve => {
    chrome.tabs.insertCSS(tabId, { file }, resolve);
  });
};

window.bootstrapTab = function (tabId) {
  window.injectScript(tabId, 'js/jquery.js')
    .then(() => window.injectStyles(tabId, 'css/content.css'))
    .then(() => window.injectScript(tabId, 'js/content.js'));
};

// Inject scripts in matching pages
chrome.tabs.onUpdated.addListener((id, change, tab) => {
  if ((change.status || '') === 'complete'
    && cachedPrefs.authpoints.findPage(tab.url)) {
    window.bootstrapTab(id);
  }
});

// Respond to page requests for latest preferences
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg === 'getPreferences') {
    const page = cachedPrefs.authpoints.findPage(sender.url || '');

    respond(page && { ...cachedPrefs, auth: page.auth });
  }  
});

// Array extensions
Array.prototype.findPage = function (pageUrl, selector) {
  const match = x => new RegExp(`^${x.replace(/\*/g, '.*')}$`);
  selector = selector || (x => x.page);

  return this.find(x => match(selector(x)).test(pageUrl));
};

// Init
window.getPrefs();