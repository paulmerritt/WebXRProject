const express = require('express');
const session = require('express-session');
const app = express();
var compression = require('compression')
var net = require('net');

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
    array.push(data.toString());
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
    recentOut3 = data.toString();
        
});

client3.on('close', function() {
    console.log('Connection closed');
});




app.get( '/', function( req, res ) {
    
    function updateFoo(){
    
        var outp = recentOut + "\n" + recentOut1 + "\n" + recentOut2 + "\n" + recentOut3;

        //res.render('index', {layout: false, out: outp});

        res.write('<p>'+outp+'</p>');           
        setTimeout( updateFoo, 3000); 
    }
    updateFoo();
});


app.listen(8080);
console.log('Started server on port 8080');