const express = require('express');
const session = require('express-session');
const app = express();
var compression = require('compression')
var net = require('net');
var reload = require('reload');
var fs = require('fs');
var https = require('https');
var exphbs = require('express-handlebars');

var sources = [];

var source_obj = {
    ip_address: "",
    port: 0,
    client: null,
    out: "",
    coords: 
        {
            latitude: 0.0, longitude: 0.0
        },
    marker: "",
    color: ""
}

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var data = null;

const fileContents = fs.readFileSync('./config.json', 'utf8')

try {
  data = JSON.parse(fileContents)
  //console.log(data.sources);
} catch(err) {
  console.error(err)
}


data.sources.forEach(src=>{

    var source = Object.create(source_obj);
    source.ip_address = src.server_ip;
    source.port = src.port;
    source.client = new net.Socket();
    source.color = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        

    source.client.connect(source.port, source.ip_address, function() {
        //console.log('Connected');
    });
    
    source.client.on('data', function(data) {
        var j = JSON.parse(data.toString());
    
        source.coords.latitude = j.coords.latitude;
        source.coords.longitude = j.coords.longitude;
        source.marker = j.marker;

        source.out = JSON.stringify(j).split(',').join('\n'); //TODO: further formatting 
        //console.log(source.out);
    });
    
    source.client.on('close', function() {
        console.log('Connection closed');
    });

    sources.push(source);

});


    
app.get('/sources', (req, res) => {
    
    res.send(sources);
  });

app.get('/',function( req, res ) {
    
    res.render('index', {layout: false, sources_array: sources});

});


var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');

var credentials = {key: privateKey, cert: certificate};

// your express configuration here


var httpsServer = https.createServer(credentials, app);


httpsServer.listen(8080);
  

