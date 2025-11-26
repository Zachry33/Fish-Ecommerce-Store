import http from 'http';
import { get_user_minimal_from_username, client, add_product } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error, write_json, header_has_valid_token, write_ack } from '../httphelper.js';
import bcrypt from 'bcryptjs';

const expected_structure = {
    title: {type: 'string', min_length: 1},
    description: {type: 'string', min_length: 1},
    price: {type: 'number', min_length: 0},
    image_id: {type: 'string'},
    stock: {type: 'number', min_length: 0}
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function add_product_http(req, res, body) {

    let [is_header_valid, userdata] = await header_has_valid_token(req);

    if (!is_header_valid) return write_error("Invalid Auth Header", 401, res);

    let data = try_decode_json(body);

    if (data == null) {
        return write_error("Invalid JSON body.", 400, res);
    }

    let [is_data_valid, data_validation_err] = validate_structure(expected_structure, data);

    if (!is_data_valid) {
        return write_error(`Invalid JSON: ${data_validation_err}`, 422, res);
    }

    if (userdata.username != 'admin') {
        return write_error("Only the admin account has access to this", 401, res);
    }

    await add_product(data.image_id, data.title, data.description, data.price, data.stock);

    return write_ack(res);
}