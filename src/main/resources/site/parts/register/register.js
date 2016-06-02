var authLib = require('/lib/xp/auth');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {
  var model = {
    actionUrl: portal.componentUrl({})
  };
  return {
    body: thymeleaf.render(resolve('register.html'), model)
  }
}


exports.post = function (req) {
  var email = req.params.email;
  var pass = req.params.pass;
  var result = contextLib.run({
    branch: 'draft',
    user: {
      login: 'su',
      userStore: 'system'
    }
  }, function () {
    authLib.createUser({
      userStore: 'customers',
      name: email.split('@')[0],
      displayName: email,
      email: email
    });
  });


  return result;
}
