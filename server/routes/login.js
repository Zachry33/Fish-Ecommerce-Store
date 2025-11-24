import http from 'http';
import { get_user_minimal_from_username } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error } from '../httphelper.js';
import bcrypt from 'bcryptjs';

const expected_structure = {
    password: {type: 'string', max_length: 40, min_length: 8},
    email: {type: 'string'}
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function login(req, res, body) {

    console.log(body);
    let data = try_decode_json(body);

    if (data == null) {
        return write_error("Invalid JSON body.", 400, res);
    }

    let [is_data_valid, data_validation_err] = validate_structure(expected_structure, data);

    if (!is_data_valid) {
        return write_error(`Invalid JSON: ${data_validation_err}`, 422, res);
    }

    let users = await get_user_minimal_from_username(data.username);

    if (users.length == 0) {
        return write_error("No such user.", 404, res);
    }

    if (users[0].hash_password != bcrypt.hashSync(data.password)) {
        return write_error("Invalid password.", 401, res);
    }

    //ok they are valid.
    return write_text(create_session_token(data.username), res);
}