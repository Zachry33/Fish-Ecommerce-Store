import http from 'http';
import { write_ack } from '../httphelper.js';
/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res
 */
export default function ack(req, res) {
    return write_ack(res);
}