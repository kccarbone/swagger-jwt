let authpointUrl = null;

const fillAuth = function () {
  let $tbTarget = $(this);
  $tbTarget.hide();
};

const init = function () {
  $('.auth-header').each(function () {
    let $tbTarget = $(this).find('input');
    $('<button />')
      .text('Auth')
      .addClass('extention-auth-refresh')
      .click(fillAuth.bind($tbTarget))
      .insertAfter($tbTarget);
  });
};

$(function () {
  chrome.storage.sync.get('prefs', function (result) {
    console.log('current prefs', result);
    authpointUrl = 'test';
    init();
  });
});