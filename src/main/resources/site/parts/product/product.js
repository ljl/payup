var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var payup = require('payupLib');

exports.get = function (req) {
  var context = payup.context();

  return {
    body: thymeleaf.render(resolve('product.html'), model)
  }
};
