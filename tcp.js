//importing net to create a TCP socket
var net = require('net');
//importing fs to read through a file 
const fs = require('fs');
//array to dump each line of the file
var vital = [];

//method to read through each line of the file
//not important to go through since I copied it from stackoverflow

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

//this part is what matters
//called on each line of data

function func(data) {
  //push the current line to the array
  //TODO: remove array 
  vital.push(data);
}
//grabbing the file
var input = fs.createReadStream('mongodump\\vital.json');
//reading and recording the file contents 
readLines(input, func);
//socket setup
var port = 57000;
var server = net.createServer();
//starting TCP connection on port
server.listen(port);
//what to do when a client connects
server.on('connection', function(socket){
  //iterate through array
	vital.forEach((v, i)=>{
    //iterate every 3 seconds
		setTimeout(function(){
			try{
        //send array items 1 by 1
				socket.write(vital[i]);
				console.log(i);
				i++;
			}
			catch (e){
			}
		}, i* 3000);
	});
});