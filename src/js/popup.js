let background = null;
let preferences = null;
let page = null;

const saveAuth = function () {
  const newValue = $('input:visible').val();
  const newPage = page.url
    .replace(/^https?:/, '.*')
    .replace(/\/swagger\/.*$/, '/swagger/.*');
  
  background.setPageAuthpoint(newPage, newValue);
  window.close();
}

const init = function (savedPage) {
  const $divCreate = $('#add-auth');
  const $divUpdate = $('#update-auth');
  const $inputs = $('input');
  const $btnSubmit = $('.submit button');
  
  if (savedPage) {
    $divCreate.hide();
    $divUpdate.show()
      .find('input')
      .val(savedPage.auth);
  }

  $('.settings a').on('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('settings.html') });
	});

  $btnSubmit.on('click', saveAuth);
  $inputs.on('keydown', e => {
    if (e.which === 13) {
      saveAuth();
    }
  });
};

const getCurrentPage = function () {
  return new Promise(resolve => {
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, tabs => resolve(tabs[0]));  
  });
};

$(function () {
  getCurrentPage()
    .then(currentPage => {
      background = chrome.extension.getBackgroundPage();
      page = currentPage;
      return background.getPageAuthpoint(page.url);
    })
    .then(savedPage => init(savedPage));
});