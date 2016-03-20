var $ = require('jQuery');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

crawl(nightmare, 'http://vancouver.craigslist.ca/search/apa?postedToday=1&max_price=3500&bedrooms=2&bathrooms=2&pets_dog=1');

function crawl(nightmare, dest) {
    var curr_range, max_range, listings = {};

    nightmare.on('javascript', function(err) {
        console.log(err);
    })
    .on('error', function(err) {
        console.log(err);
    })
    .goto(dest)
    .wait();

    do {
        nightmare.evaluate(listings, function (listings) {
            var nodes = document.getElementsByClassName('hdrlnk');
            var link, title;

            for (var i=0; i<nodes.length; i++) {
                link = nodes[i].getAttribute('href');
                title = nodes[i].children[0].innerHTML;
                listings[link] = title;
            }

            curr_range = document.querySelector('.rangeTo');
            max_range = document.querySelector('.totalcount');
        });
        nightmare.click('.next')
        .wait();
    } while (curr_range < max_range);

    nightmare.end()
    .then(listings, function (listings) {
        console.log(listings);
        console.log('listings LENGTH ',listings.length);
    });
}
