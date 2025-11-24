import ack from "./routes/ack.js";
import login from "./routes/login.js";
import register from "./routes/register.js";

export const routemap = {
    "/api/register.POST": register,
    "/api/login.POST": login,
    "/api/ack.GET": ack
}