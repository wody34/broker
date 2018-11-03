var request = require('request'),
    _ = require('underscore');


var path = {
    auth: '/identity/v3/auth/tokens',
    flavors: '/compute/v2.1/flavors',
    images: '/image/v2.1/images',
    vm: '/compute/v2.1/servers'
};

var os = {};

function errorHandler(err) {
    if (err) {
        console.dir(err)
        process.exit()
    }
}

module.exports = self = {
    init: function(id, pw, url, cb) {
        request = request.defaults({baseUrl: url, json: true});
        var loginform = {
            auth: {
                identity: {
                    methods: [
                        "password"
                    ],
                    password: {
                        user: {
                            name: id,
                            domain: {
                                name: "Default"
                            },
                            password: pw
                        }
                    }
                }
            }
        };

        request.post(path.auth, {body: loginform}, function(err, res, body) {
            errorHandler(err);
            os.token = res.headers['x-subject-token'];
            console.log('Token: ' + os.token)
            request = request.defaults({headers: {'x-auth-token': os.token}});
            request.get(path.flavors, function(err, res, flavors) {
                errorHandler(err);
                os.flavors = flavors.flavors;
                console.log(flavors)
                request.get(path.images, function(err, res, images) {
                    errorHandler(err);
                    os.images = images.images;
                    console.log(images)
                    cb()
                })
            })
        })
    },
    getImage: function(name) {
        return _.findWhere(os.images, { name: name });
    },
    getFlavor: function(name) {
        return _.findWhere(os.flavors, { name: name });
    }
};

self.init('admin', 'ee614soc!', 'http://143.248.146.117', function() {

});
