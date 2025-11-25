document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartBody = document.getElementById("cart-body");

    function loadCart() {
        cartBody.innerHTML = "";
        let grandTotal = 0;

        cart.forEach((item, index) => {
            let row = `
                <tr>
                    <td><img src="${item.img}" width="80"></td>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>

                    <td>
                        <button class="btn btn-sm btn-secondary decrease" data-index="${index}">-</button>
                        <span class="mx-2 qty">${item.qty}</span>
                        <button class="btn btn-sm btn-secondary increase" data-index="${index}">+</button>
                    </td>

                    <td>$${(item.price * item.qty).toFixed(2)}</td>

                    <td>
                        <button class="btn btn-danger remove" data-index="${index}">X</button>
                    </td>
                </tr>
            `;
            grandTotal += item.price * item.qty;
            cartBody.innerHTML += row;
        });

        document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
        attachListeners();
    }

    function attachListeners() {
        // Increase Qty
        document.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", () => {
                let index = btn.dataset.index;
                cart[index].qty++;
                saveAndReload();
            });
        });

        // Decrease Qty
        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", () => {
                let index = btn.dataset.index;
                if (cart[index].qty > 1) {
                    cart[index].qty--;
                }
                saveAndReload();
            });
        });

        // Remove Item
        document.querySelectorAll(".remove").forEach(btn => {
            btn.addEventListener("click", () => {
                let index = btn.dataset.index;
                cart.splice(index, 1);
                saveAndReload();
            });
        });
    }

    function saveAndReload() {
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }

    loadCart();
});