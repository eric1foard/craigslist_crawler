import "babel-polyfill";
var Nightmare = require('nightmare');
var vo = require('vo');
var fs = require('fs');

var url = '';
var links = [];

var crawl = function(target) {
    url = target;

    vo(run)(function(err, result) {
        if (err) throw err;
    })
}

function* run() {
    var nightmare = Nightmare(),
        MAX_PAGE = 10,
        currentPage = 0,
        nextExists = true;

    yield nightmare
        .on('error', function(err) { console.log(err); })
        .on('log', function(err) { console.log(err); })
        .goto(url)
        .wait('body')
        .click('#listview');

    while (nextExists && currentPage < MAX_PAGE) {
        links.push(yield nightmare
            .evaluate(function() {
                var nodes = document.getElementsByClassName('hdrlnk');
                var link, title, listings = {};

                for (var i=0; i<nodes.length; i++) {
                    link = nodes[i].getAttribute('href');
                    title = nodes[i].children[0].innerHTML;
                    listings[link] = title;
                }

                return listings;
            }));

        yield nightmare
            .click('.next')
            .wait('body')
            .screenshot('test.png')

        currentPage++;
        nextExists = yield nightmare.visible('.next');
    }

    console.dir(links);
    yield nightmare.end();
}

var updateFile = function() {
    if (!fs.exists('./post_history.json')) {
        console.log('CREATING FILE');
        fs.writeFile('./post_history.json', JSON.stringify(links, null, ' '));
    }
}

crawl('http://vancouver.craigslist.ca/search/apa?postedToday=1&max_price=3500&bedrooms=2&bathrooms=2&pets_dog=1');
