import http from 'http';
import { get_user_minimal_from_username, client } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error, write_json } from '../httphelper.js';
import bcrypt from 'bcryptjs';

const expected_structure = {
    query: {type: 'string'}
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function catalog(req, res, body) {

    let data = try_decode_json(body);

    if (data == null) {
        return write_error("Invalid JSON body.", 400, res);
    }

    let [is_data_valid, data_validation_err] = validate_structure(expected_structure, data);

    if (!is_data_valid) {
        return write_error(`Invalid JSON: ${data_validation_err}`, 422, res);
    }

    let query = "select * from products where title like ?";

    let results = await client.query(query, `%${data.query}%`);

    return write_json(results[0], res);
}