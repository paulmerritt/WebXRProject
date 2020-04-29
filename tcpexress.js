const express = require('express');
const session = require('express-session');
const app = express();
var compression = require('compression')
var net = require('net');
var reload = require('reload');
var fs = require('fs');
var https = require('https');

var client = new net.Socket();
var client1 = new net.Socket();
var client2 = new net.Socket();
var client3 = new net.Socket();

var recentOut = "";
var recentOut1 = "";
var recentOut2 = "";
var recentOut3 = "";

var output = "";

var array = [];

var coords = {
    lat:0.0, 
    long:0.0, 
};

var coords1 = {
    lat:0.0, 
    long:0.0, 
};

var coords2 = {
    lat:0.0, 
    long:0.0, 
};

var coords3 = {
    lat:0.0, 
    long:0.0, 
};

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

app.set('view engine', 'hbs');

app.use(compression());

client.connect(57000, 'localhost', function() {
    console.log('Connected');
    //client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
    console.log(data.toString());
    //array.push(data.toString());
    var j = JSON.parse(data.toString());

    coords.lat = j.coords.latitude;
    coords.long = j.coords.longitude;
    
    recentOut = data.toString();
        
});

client.on('close', function() {
    console.log('Connection closed');
});
//-----------------------------------------------------
client1.on('close', function() {
    console.log('Connection closed');
});

client1.connect(57001, 'localhost', function() {
    console.log('Connected');
    //client.write('Hello, server! Love, Client.');
});

client1.on('data', function(data) {
    console.log(data.toString());
    //array.push(data.toString());

    var j = JSON.parse(data.toString());

    coords1.lat = j.coords.latitude;
    coords1.long = j.coords.longitude;

    recentOut1 = data.toString();
        
});

client1.on('close', function() {
    console.log('Connection closed');
});

//-----------------------------------------------------
client2.on('close', function() {
    console.log('Connection closed');
});

client2.connect(57002, 'localhost', function() {
    console.log('Connected');
    //client.write('Hello, server! Love, Client.');
});

client2.on('data', function(data) {
    console.log(data.toString());
    //array.push(data.toString());

    var j = JSON.parse(data.toString());

    coords2.lat = j.coords.latitude;
    coords2.long = j.coords.longitude;

    recentOut2 = data.toString();
        
});

client2.on('close', function() {
    console.log('Connection closed');
});

//-----------------------------------------------------
client3.on('close', function() {
    console.log('Connection closed');
});

client3.connect(57003, 'localhost', function() {
    console.log('Connected');
    //client.write('Hello, server! Love, Client.');
});

client3.on('data', function(data) {
    console.log(data.toString());
    //array.push(data.toString());

    var j = JSON.parse(data.toString());

    coords3.lat = j.coords.latitude;
    coords3.long = j.coords.longitude;

    recentOut3 = data.toString();
        
});

client3.on('close', function() {
    console.log('Connection closed');
});

// var myChangingNumber = 0

// setInterval(function() {
//   myChangingNumber++
// }, 1000);



app.get('/',function( req, res ) {
    
    //function updateFoo(){
    
        var outp = "[" + recentOut + ",\n" + recentOut1 + ",\n" + recentOut2 + ",\n" + recentOut3 + "]";

        var gpsp = "latitude: " + coords.lat + "; longitude: " + coords.long + ";";

        res.render('index', {layout: false, out: outp, gps: gpsp});
        //res.write('<p>' + outp + '</p>');
        //res.send('<a-scene><a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box><a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere><a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder><a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>        <a-sky color="#ECECEC"></a-sky></a-scene><h1>Output from 4 servers:</h1><p id="demo">'+outp+'</p>');           
        //setTimeout( updateFoo, 3000); 
    //}
    //updateFoo();
});


var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');

var credentials = {key: privateKey, cert: certificate};

// your express configuration here


var httpsServer = https.createServer(credentials, app);


httpsServer.listen(8080);
  

