var thymeleaf = require('/lib/xp/thymeleaf');

var view = resolve('error.html');


exports.handleError = function (err) {
    var debugMode = err.request.params.debug === 'true';
    if (debugMode && err.request.mode === 'preview') {
        return;
    }

    var model = {
        errorCode: err.status
    };
    var body = thymeleaf.render(view, model);

    return {
        contentType: 'text/html',
        body: body
    }
};