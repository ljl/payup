var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

// Handle GET request
exports.get = handleGet;

function handleGet(req) {

    var site = portal.getSite(); // Current site
    var content = portal.getContent(); // Current content
    var view = resolve('default.html'); // The view to render
    var model = {
        mainRegion: content.page.regions['main'],
        siteName: site.displayName
    };

    return {
        body: thymeleaf.render(view, model)
    };
}
