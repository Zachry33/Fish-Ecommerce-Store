import http from 'http';
import { get_user_minimal_from_username, client, get_user_cart } from '../client.js';
import { create_session_token, try_decode_json, validate_structure, write_text, write_error, write_json, header_has_valid_token, write_ack } from '../httphelper.js';
import bcrypt from 'bcryptjs';

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 * @param {string} body
 */
export default async function get_cart(req, res, body) {

    let [is_header_valid, userdata] = await header_has_valid_token(req);

    if (!is_header_valid) return write_error("Invalid Auth Header", 401, res);
   
    let cart = await get_user_cart(userdata.id);

    cart.forEach((v) => delete v['id']);

    console.log(cart);

    return write_json(cart, res);
}