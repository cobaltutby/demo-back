var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var https = require('https');
var http = require('http');
var fs = require('fs');


app.all('*', function (req, res, next) {
    if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    }
});


app.use(express.static('../client'));
app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('file');


app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    });
});



app.get('/uploads/:id', function (req, res) {
    var content;

    fs.readFile('./uploads/database.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(content || 'FAIL');
    });

});

app.get('/checkUserPassword/', function (req, res) {

    var content;
    var email = req.query.email;
    var password = req.query.password;

    fs.readFile('./uploads/database.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }

        database = JSON.parse(data);
        var user_list = database.user_list;
        var response = 'FAIL';
        user_list.forEach(function (user) {
            if (user.email === email && user.password === password) {
                response = 'OK';
                return;
            }

        }, this);
        res.send(response);
    });

});

app.get('/checkUserEmail/', function (req, res) {

    var email = req.query.email;

    fs.readFile('./uploads/database.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }

        database = JSON.parse(data);
        var user_list = database.user_list;
        var response = 'FAIL';
        user_list.forEach(function (user) {
            if (user.email === email) {
                response = 'OK';
                return;
            }

        }, this);
        res.send(response);
    });

});

app.get('/getUser/', function (req, res) {
    var content;

    var email = req.query.email;
    var password = req.query.password;

    fs.readFile('./uploads/database.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }

        database = JSON.parse(data);
        var user_list = database.user_list;
        var response = 'FAIL';
        user_list.forEach(function (user) {
            if (user.email === email && user.password === password) {
                response = user;
                return;
            }

        }, this);
        res.send(response);
    });

});

app.get('/getUserTripData/', function (req, res) {
    var content;

    var email = req.query.email;
    var password = req.query.password;

    fs.readFile('./uploads/database.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }

        database = JSON.parse(data);
        var user_list = database.user_list;
        var user_data = database.user_data;
        var response = [];
        user_list.forEach(function (user) {
            if (user.email === email && user.password === password) {
                user_data.forEach(function (trip) {
                    if (trip.email === email) {
                        response.push(trip);
                    }
                }, this);

            }

        }, this);
        res.send(response);
    });

});

console.log('Server running at http://146.185.150.183:3000/');
http.createServer(app).listen(3000, '146.185.150.183');

