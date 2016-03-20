var $ = require('jQuery');
var Nightmare = require('nightmare');

var nm = crawl(false, 'http://vancouver.craigslist.ca/search/apa?postedToday=1', {}, 0, 0, 0);

function crawl(nightmare, dest, listings, curr_range, max_range, n) {

    // termination condition
    // if (curr_range >= max_range && curr_range > 0 && max_range > 0 &&
    //     nightmare) {
    if (n >= 3) {
            console.log('TERMINATING ', listings);
            nightmare.end()
            .then(listings, function () {
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
            .on('log', function(err) {
                console.log(err);
            })
            .goto(dest)
            .wait();
        }

        console.log('after init');

        nightmare.evaluate(listings, function () {
            var nodes = document.getElementsByClassName('hdrlnk');

            console.log(nodes);

            var link, title;

            for (var i=0; i<nodes.length; i++) {
                link = nodes[i].getAttribute('href');
                title = nodes[i].children[0].innerHTML;
                listings[link] = title;
            }

            console.log('current listings: ',listings);

            curr_range = document.querySelector('.rangeTo');
            max_range = document.querySelector('.totalcount');

            return {
                nightmare: nightmare,
                dest: dest,
                listings: listings,
                curr_range: curr_range,
                max_range: max_range,
                n: n
            };
        })
        .click('.next')
        .wait()
        .then(function(args) {
            console.log(' from calling then');
            args.n += 1;
            return crawl(args.nightmare, args.dest, args.listings, args.curr_range, args.max_range, args.n);
        });
    }
