let background = null;
let preferences = null;
let page = null;

const init = function () {
  $('.current-page').text(page.url);
};

const getCurrentPage = function (callback) {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    callback(tabs[0]);
  });
};

$(function () {
  background = chrome.extension.getBackgroundPage();
  background.getPrefs(function (result) {
    preferences = result;
    getCurrentPage(function (currentPage) {
      page = currentPage;
      init();
    })
  });
});