var request = require('request'),
    _ = require('underscore');


var os = {};

function errorHandler(err) {
    if (err) {
        console.dir(err);
        process.exit()
    }
}

module.exports = self = {
    init: function(id, pw, url, cb) {
        // create our client with your openstack credentials
        os.client = require('pkgcloud').compute.createClient({
            provider: 'openstack',
            username: id,
            password: pw,
            domainName: 'Default',
            tenantId: 'db1d1755f8f54586b7347e86156dafdd',
            region: 'RegionOne', //default for DevStack, might be different on other OpenStack distributions
            authUrl: url+'/identity',
            keystoneAuthVersion: 'v3'
        });

        os.client.getFlavors(function (err, flavors) {
            if (err) {
                console.dir(err);
                return;
            }
            console.log(flavors)
            os.flavors = flavors;
            // then get our base images
            os.client.getImages(function (err, images) {
                if (err) {
                    console.dir(err);
                    return;
                }
                console.log(images)
                os.images = images;
                cb()
            });
        });
    },
    getImage: function(name) {
        return _.findWhere(os.images, { name: name });
    },
    getFlavor: function(name) {
        return _.findWhere(os.flavors, { name: name });
    },
};

self.createVM = function(info) {
    var flavor = self.getFlavor(info.flavor);
    var image = self.getImage(info.image);
    var cloudConfig = '#cloud-config\npassword: ee614soc\nchpasswd: { expire: False }\nssh_pwauth: True';
    // Create our first server
    os.client.createServer({
        name: info.name,
        image: image,
        flavor: flavor,
        cloudConfig: Buffer.from(cloudConfig).toString('base64'),
    }, function (err, server) {
        if (err) {
            console.dir(err);
            return;
        }

        console.log('SERVER CREATED: ' + server.name + ', waiting for active status');

        // Wait for status: RUNNING on our server, and then callback
        server.setWait({ status: server.STATUS.running }, 2000, function (err) {
            if (err) {
                console.dir(err);
                return;
            }

            console.log('SERVER INFO');
            console.log(server.name);
            console.log(server.status);
            console.log(server.id);

            console.log('Make sure you DELETE server: ' + server.id +
                ' in order to not accrue billing charges');
        });
    });
};

self.init('admin', 'ee614soc!', 'http://143.248.146.117', function() {
    self.createVM({
        name: 'worker',
        image: 'lab11vm',
        flavor: 'test.small'
    });
});
