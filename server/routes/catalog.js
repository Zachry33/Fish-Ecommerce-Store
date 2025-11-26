import http from 'http';
import { get_user_minimal_from_username, client } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error, write_json, parse_query_string } from '../httphelper.js';
import bcrypt from 'bcryptjs';

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 * @param {string} querystr
 */
export default async function catalog(req, res, body, querystr) {

    let q = parse_query_string(querystr);

    if (!q || !q['query']) return write_error("Missing query string parameter 'query'", 400, res);

    let query = "select * from products where title like ?";

    let results = await client.query(query, `%${q.query}%`);

    return write_json(results[0], res);
}