import { readFileSync } from 'fs';
import http from 'http';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { client } from './client.js';
/**
 * @param {string} error
 * @param {number} code
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
export function write_error(error, code, res) {
    res.writeHead(code ?? 501, {"content-type": "text/plain"});
    res.write(error ?? "Something went wrong!");
    res.end();
}
/**
 * @param {string} value
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
export function write_text(value, res) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write(value);
    res.end();
}

/**
 * @param {object} value
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
export function write_json(value, res) {
    res.writeHead(200, {'content-type': 'application/json'});
    res.write(JSON.stringify(value));
    res.end();
}

/**
 * @param {string} value
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
export function write_html(value, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.write(value);
    res.end();
}

/**
 * 
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
export function write_ack(res) {
    res.writeHead(200, {"content-type": "text/plain"});
    res.write("OK");
    res.end();
}
/**
 * 
 * @param {string} str
 * @returns {object | null}
 */
export function try_decode_json(str) {
    try {
        let json = JSON.parse(str);
        return json;
    }
    catch (e) {
        console.log(e, str);
        return null; //has to be a syntax error. Can't parse the json.
    }
}

/**
 * 
 * @param {{[k: string]: {type: string, max_length?: number, min_length?: number, optional?: boolean}}} structure 
 * @param {object} input 
 * @returns {[boolean, string]}
 */
export function validate_structure(structure, input) {
    for (let key of Object.keys(structure)) {
        let data = structure[key];

        if (typeof input[key] == "undefined" || input[key] == null && !data.optional) {
            return [false, `Key "${key}" is missing, but is required.`];
        }

        if (typeof input[key] != data.type) {
            return [false, `Key "${key}" is of type ${typeof input[key]} when it should be ${data.type}`];
        }
        if (typeof input[key] == 'string' && (data.min_length && input[key].length < data.min_length || (data.max_length && input[key].length > data.max_length))) {
            return [false, `Key "${key}" must have a length between ${data.min_length || 0} and ${data.max_length || "infinity"}`];
        }
        if (typeof input[key] == 'number' && (data.min_length && input[key] < data.min_length || (data.max_length && input[key] > data.max_length))) {
            return [false, `Key "${key}" must have a value between ${data.min_length || '-infinity'} and ${data.max_length || "infinity"}`];
        }
    }

    return [true, ""];
}

const SIGNING_SECRET = "tvrdur7n6nersdmpercvdu9snvy864en3ve5b5udrvnsye9byw45vw";

/**
 * 
 * @param {string} username 
 * @returns {string}
 */
export function create_session_token(username) {
    let token = sign({username: username}, SIGNING_SECRET);
    return token;
}

/**
 * 
 * @param {string} token 
 * @returns {[boolean, object | null]}
 */
export async function validate_session_token(token) {
    let v = verify(token, SIGNING_SECRET);
    if (v && v.username) {
        let res = await client.query("select * from users where username = ?", [v.username]);
        if (res[0].length > 0) {
            return [true, res[0][0]];
        }
    }
    return [false, null];
}

/**
 * 
 * @param {http.IncomingMessage} req
 * @returns {[boolean, object | null]}
 */
export async function header_has_valid_token(req) {
    let header = req.headers['fishy-token'];

    if (!header || typeof header != 'string') return [false, null];

    return await validate_session_token(header);
}

/**
 * 
 * @param {string} str 
 * @returns {{[k: string]: string} | null}
 */
export function parse_query_string(str) {
    let data = str.split('=');
    
    if (data.length % 2 != 0) return null;

    let map = {};

    for (let i = 0; i < data.length; i+=2) {
        let key = data[i];
        let value = data[i + 1];

        map[key] = value;
    }

    return map;
}