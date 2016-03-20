var $ = require('jQuery');
var Nightmare = require('nightmare');

var nm = crawl(false, 'http://vancouver.craigslist.ca/search/apa?postedToday=1', {}, 0, 0, 0);

function crawl(nightmare, dest, listings, curr_range, max_range, n) {

    // termination condition
    // if (curr_range >= max_range && curr_range > 0 && max_range > 0 &&
    //     nightmare) {
    if (n >= 3) {
            console.log('TERMINATING');
            nightmare.end()
            .then(listings, function (listings) {
                console.log(listings);
                console.log('listings LENGTH ',listings.length);
            });
            return;
            //return listings;
        }

        // first call
        if (!nightmare) {
            console.log('FIRST CALL');
            nightmare = Nightmare({ show: true });
            nightmare.on('javascript', function(err) {
                console.log(err);
            })
            .on('error', function(err) {
                console.log(err);
            })
            .goto(dest)
            .wait();
        }

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

        return crawl(nightmare, dest, listings, curr_range, max_range, ++n);
    }
