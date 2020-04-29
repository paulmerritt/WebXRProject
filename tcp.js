var net = require('net'), JsonSocket = require('json-socket');
const fs = require('fs');
var vital = [];
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
  vital.push(data);
}
var input = fs.createReadStream('mongodump\\vital.json');
readLines(input, func);
var port = 57000;
var server = net.createServer();
server.listen(port);
server.on('connection', function(socket){
  //socket = new JsonSocket(socket);
	vital.forEach((v, i)=>{
		setTimeout(function(){
			try{
				socket.write(vital[i]);
				console.log(i);
				i++;
			}
			catch (e){
			}
		}, i* 3000);
	});
});