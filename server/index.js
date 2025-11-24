import http from 'http';
import { routemap } from './routemap.js';
import { write_error } from './httphelper.js';
import * as _a from './client.js';

const server = http.createServer();

server.on("request", (req, res) => {
    let url = req.url;
    let method = req.method;
    let routemapping = `${url}.${method}`;

    let body = "";
    req.on("data", (v) => body += v.toString());
    req.on("end", () => {
        if (routemapping in routemap) {
            return routemap[routemapping](req, res, body);
        }
        else {
            return write_error(`Route ${url} not found with method ${method}.`, 404, res);
        }
    })
})

server.listen(6741);