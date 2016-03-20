var $ = require('jQuery');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

crawl(nightmare, {}, 'http://vancouver.craigslist.ca/search/apa?postedToday=1');

function crawl(nightmare, listings, dest) {
    var curr_range, max_range;

    nightmare.on('javascript', function(err) {
        console.log(err);
    })
    .on('error', function(err) {
        console.log(err);
    })
    .goto(dest)
    .wait(2000)
    .evaluate(listings, function () {
                var nodes = document.getElementsByClassName('hdrlnk');
                var link, title;

                for (var i=0; i<nodes.length; i++) {
                    link = nodes[i].getAttribute('href');
                    title = nodes[i].children[0].innerHTML;
                    listings[link] = title;
                }

                curr_range = document.querySelector('.rangeTo');
                max_range = document.querySelector('.totalcount');

                return listings;
            })
            //nightmare.click('.next').wait(2000);
    //
    //     return listings;
    // }, function(err) {
    //     console.log(err);
    // })
    .end()
    .then(function (listings) {
        console.log(listings);
        console.log('listings LENGTH ',listings.length);
    });
}
