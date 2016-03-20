var $ = require('jQuery');
var Nightmare = require('nightmare');

function* run(url) {
    var nightmare = Nightmare({show: true}),
        MAX_PAGE = 10,
        currentPage = 0,
        nextExists = true,
        links = [];

    yield nightmare
        .goto(url)
        .wait('body')
}
