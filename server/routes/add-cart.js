import http from 'http';
import { get_user_minimal_from_username, client } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error, write_json, header_has_valid_token, write_ack } from '../httphelper.js';
import bcrypt from 'bcryptjs';

const expected_structure = {
    item_id: {type: 'number'},
    quantity: {type: 'number', min_length: 1}
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function add_cart(req, res, body) {

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

    {
        let q = await client.query("select * from products where item_id = ?", data.item_id);

        if (q[0].length == 0) {
            return write_error("That product does not exist.", 404, res);
        }
    }

    {
        let q = await client.query("select * from cart_items where id = ? and item_id = ?", [userdata.id, data.item_id]);

        if (q[0].length > 0) {
            let quantity = q[0][0].quantity;
            let results = await client.query("update cart_items SET quantity = ? where id = ? and item_id = ?", [quantity + data.quantity, userdata.id, data.item_id]);
            console.log(results, 'a!');
        }
        else {
            let query = "insert into cart_items (item_id, id, quantity) values (?, ?, ?)";

            let results = await client.query(query, [data.item_id, userdata.id, data.quantity]);

            console.log(results, 'b!');
        }
    }

    return write_ack(res);
}