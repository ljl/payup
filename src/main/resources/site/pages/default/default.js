var libs = {
  portal: require('/lib/xp/portal'),
  thymeleaf: require('/lib/xp/thymeleaf')
};
var cartLib = require('cartLib');
var customerLib = require('customerLib');
var contentHelper = require('contentHelper');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');

// Handle GET request
exports.get = handleGet;

function handleGet(req) {

  var site = libs.portal.getSite(); // Current site
  var content = libs.portal.getContent(); // Current content
  var view = resolve('default.html'); // The view to render
  var model = createModel(); // The model to send to the view

  function createModel() {
    var model = {};

    model.mainRegion = content.page.regions['main'];
    model.siteName = site.displayName;

    return model;
  }

  return {
    body: libs.thymeleaf.render(view, model)
  };
}
