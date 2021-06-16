const express = require('express');
const session = require('express-session');
const app = express();
var compression = require('compression')
var net = require('net');
var reload = require('reload');
var fs = require('fs');
var https = require('https');
var exphbs = require('express-handlebars');
var cors = require('cors');

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
    color: "",
    bottom_color: ""
}
app.use(cors());
app.engine('handlebars', exphbs());
app.use("/dist", express.static('./dist/'));
app.set('view engine', 'handlebars');

var data = null;

const fileContents = fs.readFileSync('./config.json', 'utf8')

try {
  data = JSON.parse(fileContents)
  //console.log(data.sources);
} catch(err) {
  console.error(err)
}

// function hexToRgb(hex) {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//       r: parseInt(result[1], 16),
//       g: parseInt(result[2], 16),
//       b: parseInt(result[3], 16)
//     } : null;
//   }

data.sources.forEach(src=>{

    var source = Object.create(source_obj);
    source.ip_address = src.server_ip;
    source.port = src.port;
    source.client = new net.Socket();
    source.color = "" + Math.floor(Math.random() * 256).toString(); + " " + Math.floor(Math.random() * 256).toString(); + " " + Math.floor(Math.random() * 256).toString();//"#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    source.bottom_color = "" + Math.floor(Math.random() * 256).toString(); + " " + Math.floor(Math.random() * 256).toString(); + " " + Math.floor(Math.random() * 256).toString();//"#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

    source.client.connect(source.port, source.ip_address, function() {
        //console.log('Connected');
    });
    
    source.client.on('data', function(data) {
        var j = JSON.parse(data.toString());
    
        source.coords.latitude = j.coords.latitude;
        source.coords.longitude = j.coords.longitude;
        source.marker = j.marker;

        source.out = JSON.stringify(j).split(',').join('\n'); //TODO: further formatting 
        source.out = source.out.slice(1,-1);
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
    
    res.render('prog', {layout: false, sources_array: sources});

});

app.get('/testlas',function( req, res ) {

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    
    res.render('testlas', {layout: false});

});

var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');

var credentials = {key: privateKey, cert: certificate};

// your express configuration here


var httpsServer = https.createServer(credentials, app);


httpsServer.listen(8080);
  

