var net = require('net'), JsonSocket = require('json-socket');
const fs = require('fs');
var ori = [];
function readLines(input, func) {
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });
  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}
function func(data) {
    ori.push(data);
}
var input = fs.createReadStream('mongodump\\orientation.json');
readLines(input, func);
var port = 57002;
var server = net.createServer();
server.listen(port);
server.on('connection', function(socket){
	//socket = new JsonSocket(socket);
	ori.forEach((v, i)=>{
		setTimeout(function(){
			try{
				socket.write(ori[i]);
				console.log(i);
				i++;
			}
			catch (e){
			}
		}, i* 3000);
	});
});