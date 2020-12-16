const http = require('http');
const path = require('path');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

let server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function handleRequest(req, res) {
  // What did we request?
  let pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  // Ok what's our file extension
  let ext = path.extname(pathname);

  // Map extension to file type
  const typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  let contentType = typeExt[ext] || 'text/plain';

  // Now read and write back the file with the appropriate content type
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Dynamically setting content type
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );

  if (req.method === "POST") {
        var body = "";
        var file_str;
        var filename;
        req.on("data", function (chunk) {
            body += chunk;
        });
        req.on("end", function(){
            file_str = JSON.parse(body).data;
            filename = JSON.parse(body).filename;
            fs.writeFile("data/"+filename, file_str, function (err) {
              if (err) return console.log(err);
              console.log('data file > ' + filename);
            });
        });
    }
}
