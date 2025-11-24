import http from 'http';
import { client, get_user_minimal_from_email, get_user_minimal_from_username } from '../client.js';
import { try_decode_json, validate_structure, write_ack, write_error } from '../httphelper.js';
import bcrypt from 'bcryptjs';

const expected_structure = {
    username: {type: 'string', max_length: 20, min_length: 3},
    password: {type: 'string', max_length: 40, min_length: 8},
    email: {type: 'string'}
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function register(req, res, body) {

    console.log(body);
    let data = try_decode_json(body);

    if (data == null) {
        return write_error("Invalid JSON body.", 400, res);
    }

    let [is_data_valid, data_validation_err] = validate_structure(expected_structure, data);

    if (!is_data_valid) {
        return write_error(`Invalid JSON: ${data_validation_err}`, 422, res);
    }

    {
        let users = await get_user_minimal_from_username(data.username);

        if (users.length > 0) {
            return write_error("User with that username already exists.", 400, res);
        }
    }

    {
        let users = await get_user_minimal_from_email(data.email);

        if (users.length > 0) {
            return write_error("User with that email already exists.", 400, res);
        }
    }

    let hashed_password = bcrypt.hashSync(data.password);

    let query = "insert into users (username, hash_password, email) values (?, ?, ?)";

    let db_res = await client.query(query, [data.username, hashed_password, data.email]);
	
    return write_ack(res);
}