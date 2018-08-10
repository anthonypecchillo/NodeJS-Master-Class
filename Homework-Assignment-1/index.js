// ------------------------
// Primary file for the API
//-------------------------

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => unifiedServer(req, res));

// Start the HTTP server
httpServer.listen(config.httpPort, () => console.log(`The HTTP server is listening on port ${config.httpPort} in ${config.envName} mode...`));


// Instantiate the HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => unifiedServer(req, res));

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => console.log(`The HTTPS server is listening on port ${config.httpsPort} in ${config.envName} mode...`));


// All the server logic for both the HTTP and HTTPS server
const unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true);

  // Get the path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');  // Trims off the slashes from both sides
                                                       // (Helps us to handle requests to /foo and /foo/ equally.)

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toUpperCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get payload, if any exists
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (chunk) => buffer += decoder.write(chunk));
  
  req.on('end', () => {
    buffer += decoder.end()

    // Choose the handler this request should go to
    // If one is not found, use the notFound handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log(`Request recieved with this payload: ${buffer}`);
    });

  });
};


// Define the handlers
let handlers = {};

// Hello handler
handlers.hello = (data, callback) => callback(200, {'message': 'Hello World!'});

// Not found handler
handlers.notFound = (data, callback) => callback(404); 


// Define a request router
const router = {
  'hello': handlers.hello
}
