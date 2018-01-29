let background = null;
let preferences = null;

const savePrefix = function () {
  background.setHeaderPrefix($('#auth-header-prefix').val());
};

const addAuth = function (e) {
  const newPage = $('.new-page').val();
  const newAuth = $('.new-auth').val();

  if (e.which === 13 && newPage && newAuth) {
    console.log(newPage, newAuth);
  }
};

const removeAuth = function (e) {
  const $row = $(this);
  const page = $row.find('.val-page').text();

  if ($(e.target).parents('svg').length > 0) {
    console.log(page);
  }
};

const blurOnEnter = function (e) {
  if (e.which === 13) {
    $(e.target).trigger('blur');
  }
};

const init = function () {
  const $authPrefix = $('#auth-header-prefix');
  const $authTable = $('#auth-table tbody');

  $authPrefix.val(preferences.headerPrefix)
    .on('keydown', blurOnEnter)  
    .on('blur', savePrefix);

  preferences.authpoints.forEach(x => {
    const $newRow = $('<tr />').appendTo($authTable).on('click', removeAuth);
    const $remove = $('<i />').addClass('fas fa-trash-alt');
    $('<td />').append($remove).appendTo($newRow);
    $('<td />').addClass('val-page').text(x.page).appendTo($newRow);
    $('<td />').addClass('val-auth').text(x.auth).appendTo($newRow);
  });

  const $newRow = $('<tr />').addClass('new-row').appendTo($authTable);
  const $newIcon = $('<i />').addClass('fas fa-plus');
  const $newPage = $('<input />')
    .attr('type', 'text')
    .attr('placeholder', 'Regex page match')
    .addClass('new-page')
    .on('keydown', addAuth);
  const $newAuth = $('<input />')
    .attr('type', 'text')
    .attr('placeholder', 'JWT request url')
    .addClass('new-auth')
    .on('keydown', addAuth);
  
  $('<td />').append($newIcon).appendTo($newRow);
  $('<td />').append($newPage).appendTo($newRow);
  $('<td />').append($newAuth).appendTo($newRow);
};

$(function () {
  background = chrome.extension.getBackgroundPage();
  background.getPrefs().then(prefs => {
    preferences = prefs;
    init();
  });
});