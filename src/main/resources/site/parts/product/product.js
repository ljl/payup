var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function (req) {

  return {
    body: thymeleaf.render(resolve('product.html'), model)
  }
};
