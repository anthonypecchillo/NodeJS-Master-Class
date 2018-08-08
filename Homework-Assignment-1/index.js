// ------------------------
// Primary file for the API
//-------------------------

// Dependencies
const http = require('http');

// The HTTP server should respond to all requests with a string
const httpServer = http.createServer((req, res) => {
  res.send('Hello World!\n');
});


// Start the HTTP server and have it listen on port 3000
httpServer.listen(3000, function() {
  console.log('The HTTP server is listening on port 3000...');
});
