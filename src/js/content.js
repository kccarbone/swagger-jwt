$(function () {
  const fillAuth = function (e) {
    const target = this;
    e.preventDefault();
    e.stopPropagation();

    if (!$(target).parent().hasClass('fetch')) {
      startProgress(target);

      getPrefs().then(prefs => {
        setTimeout(() => {
          $.get(prefs.auth)
            .then(function (token) {
              endProgress(target, `${prefs.headerPrefix} ${token}`);
            })
            .catch(function () {
              endProgress(target, false);
            });
        }, 300);
      });
    }
  };

  const init = function (prefs) {
    if ($(prefs.fieldSelector).length) {
      $(prefs.fieldSelector)
        .wrap('<div class="jwt-wrapper" />')
        .each(function () {
          let $tbTarget = $(this)
            .addClass('jwt-target');

          $('<div />')
            .addClass('jwt-auth-mask')
            .insertAfter($tbTarget)
            .append(($('<div />')
              .html('&nbsp;')
              .addClass('jwt-auth-fill')));

          $('<button />')
            .text('Get Token')
            .addClass('jwt-auth-refresh')
            .click(fillAuth.bind($tbTarget))
            .insertAfter($tbTarget);
        });
    }
    else {
      setTimeout(() => init(prefs), 500);
    }
  };

  const startProgress = function (target) {
    let $tbTarget = $(target);
    let $wrapper = $tbTarget.parent().addClass('fetch');

    setTimeout(function () {
      $tbTarget.val('Fetching token...');
      $wrapper.show().addClass('loading');
    });
  };

  const endProgress = function (target, successMsg) {
    let $tbTarget = $(target);
    let $wrapper = $tbTarget.parent();

    $tbTarget.val(successMsg || 'Token fetch failed');
    $wrapper.removeClass('loading')
      .addClass(successMsg ? 'success' : 'failure');

    setTimeout(function () {
      $wrapper.addClass('fadeout');
    }, 200);

    setTimeout(function () {
      $wrapper.removeClass('success')
        .removeClass('failure')
        .removeClass('fadeout')
        .removeClass('fetch');
    }, 700);
  };

  const getPrefs = function () {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        chrome.runtime.id,
        'getPreferences',
        prefs => resolve(prefs));
    });
  };
  
  if (!window.jwtAuthBootstrapped) {
    getPrefs().then(init);
  }

  window.jwtAuthBootstrapped = true;
});