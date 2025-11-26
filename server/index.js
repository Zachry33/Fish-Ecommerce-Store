import http from 'http';
import { routemap } from './routemap.js';
import { write_error } from './httphelper.js';
import * as _a from './client.js';
import fs from 'fs';

const server = http.createServer();

server.on("request", (req, res) => {
    let url = req.url;
    if (url == '/') {
        url = '/home';        
    }

    let split = url.split('?');
    url = split[0];
    let querystr = split[1];

    let method = req.method;
    let routemapping = `${url}.${method}`;

    let body = "";

    req.on("data", (v) => body += v.toString());
    req.on("end", () => {
        if (routemapping in routemap) {
            return routemap[routemapping](req, res, body, querystr);
        }
        else {
            fs.readFile("client/public" + url, (err, data) => {
                if (url.endsWith('html')) {
                    res.writeHead(200, {'content-type': 'text/html'});
                }
                if (err) {console.log(err)}
                if (err) return write_error(`Route ${url} not found with method ${method}.`, 404, res);
                res.end(data);
            });
        }
    })
})

server.listen(6741);