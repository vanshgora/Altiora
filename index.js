const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    const filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    const extName = path.extname(filePath);

    const mimeType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
    }

    const contentType = mimeType[extName];

    fs.readFile(filePath, (err, content) => {
        if(err) {
            res.writeHead(400),
            res.end("Error while processing");
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
