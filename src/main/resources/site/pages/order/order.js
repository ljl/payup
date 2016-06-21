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

exports.get = handleGet;

function handleGet(req) {
    var content = libs.portal.getContent();
    var view = resolve('order.html');

    var model = {
        content: content
    };
    
    return {
        body: libs.thymeleaf.render(view, model)
    };
}
