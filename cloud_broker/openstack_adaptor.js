var request = require('request'),
    _ = require('underscore'),
    async = require('async');

var os = {};

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
            os.flavors = flavors;
            // then get our base images
            os.client.getImages(function (err, images) {
                if (err) {
                    console.dir(err);
                    return;
                }

                os.images = images;
                if(cb)
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

self.createVM = function(info, callback) {
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

            vm = {
                id: server.id,
                ipAddr: (_.findWhere(server.addresses.private, {version: 4})).addr
            };

            console.log('SERVER Created', vm);

            trial = function() {
                url = 'http://' + vm.ipAddr + ':3000/init';
                request({method: 'GET', url: url}, function (err, res, body) {
                    if (err) {
                        console.log(err)
                        setTimeout(function() {
                            console.log('retry');
                            trial();
                        }, 2000);

                    }
                    else if (res.statusCode == 200) {
                        console.log(body);
                        console.log('VM Initialized!');
                        if(callback)
                            callback(vm)
                    }
                });
            };
            trial();
        });
    });
};

self.terminateVM = function(server, cb) {
    os.client.destroyServer(server.id, function (err, server) {
        if (err) {
            console.dir(err);
            return
        }
        if (cb)
            cb()
    });
};
//
self.init('admin', 'ee614soc!', 'http://143.248.146.117', function() {

});
