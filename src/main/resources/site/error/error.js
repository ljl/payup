var thymeleaf = require('/lib/xp/thymeleaf');

var view = resolve('error.html');


exports.handleError = function (err) {
    log.error("******* ERROR *********");
    log.error(JSON.stringify(err, null, 2));
    var debugMode = err.request.params.debug === 'true';
    if (debugMode && err.request.mode === 'preview') {
        return;
    }

    var model = {
        errorCode: err.status,
        message: err.message
    };
    var body = thymeleaf.render(view, model);

    return {
        contentType: 'text/html',
        body: body
    }
};