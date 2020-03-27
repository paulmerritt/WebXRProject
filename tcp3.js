var net = require('net'), JsonSocket = require('json-socket');
const fs = require('fs');
var env = [];
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
    env.push(data);
}
var input = fs.createReadStream('mongodump\\environmental.json');
readLines(input, func);
var port = 57003;
var server = net.createServer();
server.listen(port);
server.on('connection', function(socket){
	//socket = new JsonSocket(socket);
	env.forEach((v, i)=>{
		setTimeout(function(){
			try{
				socket.write(env[i]);
				console.log(i);
				i++;
			}
			catch (e){
			}
		}, i* 3000);
	});
});