let background = null;

const syncComplete = function () {
  $('.saved').stop().show().css('opacity', 1).fadeOut(3000);
}

const savePrefix = function () {
  background.setHeaderPrefix($('#auth-header-prefix').val())
    .then(syncComplete);
};

const saveSelector = function () {
  background.setFieldSelector($('#field-selector').val())
    .then(syncComplete);
};

const addAuth = function (e) {
  const newPage = $('.new-page').val().trim();
  const newAuth = $('.new-auth').val().trim();

  if (e.which === 13 && newPage && newAuth) {
    background.setPageAuthpoint(newPage, newAuth)
      .then(() => background.getPrefs())
      .then((prefs) => {
        updateSavedAuths(prefs.authpoints);
        syncComplete();
      });
  }
};

const removeAuth = function (e) {
  const $row = $(this);
  const page = $row.find('.val-page').text();

  if ($(e.target).parents('td').find('svg').length > 0) {
    background.removePageAuthpoint(page)
      .then(() => background.getPrefs())
      .then((prefs) => {
        updateSavedAuths(prefs.authpoints);
        syncComplete();
      });
  }
};

const blurOnEnter = function (e) {
  if (e.which === 13) {
    $(e.target).trigger('blur');
  }
};

const updateSavedAuths = function (auths) {
  const $authTable = $('#auth-table tbody').empty();

  auths.forEach(x => {
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
    .attr('placeholder', 'Swagger page url')
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
}

const init = function (prefs) {
  $('#auth-header-prefix').val(prefs.headerPrefix)
    .on('keydown', blurOnEnter)
    .on('blur', savePrefix);
  
  $('#field-selector').val(prefs.fieldSelector)
    .on('keydown', blurOnEnter)
    .on('blur', saveSelector);

  updateSavedAuths(prefs.authpoints);
};

$(function () {
  background = chrome.extension.getBackgroundPage();
  background.getPrefs().then(init);
});