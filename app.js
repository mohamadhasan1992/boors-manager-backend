const http = require('http');
const express = require('epress');

const app = express();

const port = 8000;
const hostname = "127.0.0.2";

const server = http.createServer((req,res) => {
    res.end("hello from boors manager");
});
server.listen(port, hostname, () => {
    console.log("listening to port 8000");
})