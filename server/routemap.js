import ack from "./routes/ack.js";
import add_cart from "./routes/add-cart.js";
import catalog from "./routes/catalog.js";
import get_cart from "./routes/get-cart.js";
import home from "./routes/home.js";
import login from "./routes/login.js";
import register from "./routes/register.js";

export const routemap = {
    "/api/register.POST": register,
    "/api/login.GET": login,
    "/api/ack.GET": ack,
    "/home.GET": home,
    "/api/catalog.GET": catalog,
    "/api/addcart.POST": add_cart,
    "/api/getcart.GET": get_cart
}