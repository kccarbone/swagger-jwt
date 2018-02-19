const fillAuth = function () {
  let $tbTarget = $(this);

  getPrefs().then(prefs => {
    $tbTarget.val(`${prefs.headerPrefix} ${prefs.auth}`);
  });
};

const init = function (prefs) {
  $(prefs.fieldSelector).each(function () {
    let $tbTarget = $(this)
      .find('input')
      .addClass('jwt-target');
    
    $('<button />')
      .text('Auth')
      .addClass('extention-auth-refresh')
      .click(fillAuth.bind($tbTarget))
      .insertAfter($tbTarget);
  });
};

const getPrefs = function () {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      chrome.runtime.id,
      'getPreferences',
      prefs => resolve(prefs));
  });
};

$(function () {
  getPrefs().then(init);
});