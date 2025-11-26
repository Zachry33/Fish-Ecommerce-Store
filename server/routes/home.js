import http from 'http';
import { get_user_minimal_from_username, client } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error, write_html } from '../httphelper.js';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function home(req, res, body) {
    let page = readFileSync("client/public/index.html", {encoding: 'utf-8'});

    return write_html(page, res);
}