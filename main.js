var $ = require('jQuery');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

crawl(nightmare, 'http://vancouver.craigslist.ca/search/apa?postedToday=1');

function crawl(nightmare, dest) {
    var curr_range, max_range, listings = [];

    nightmare.on('javascript', function(err) {
        console.log(err);
    })
    .on('error', function(err) {
        console.log(err);
    })
    .goto(dest)
    .wait(1000);

        do {
            listings.push(nightmare.evaluate(function () {
                var nodes = document.getElementsByClassName('hdrlnk');
                var link, title, temp_listings;

                for (var i=0; i<nodes.length; i++) {
                    link = nodes[i].getAttribute('href');
                    title = nodes[i].children[0].innerHTML;
                    temp_listings[link] = title;
                }

                curr_range = document.querySelector('.rangeTo');
                max_range = document.querySelector('.totalcount');

                console.log(temp_listings)

                return temp_listings;

            }));

            nightmare.click('.next')
            .wait();
        } while (curr_range < max_range);

    nightmare.end()
    .then(function (listings) {
        console.log(listings);
        console.log('listings LENGTH ',listings.length);
    });
}
