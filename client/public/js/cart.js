document.addEventListener("DOMContentLoaded", () => {
    const navLink = document.querySelector(".nav-link[href='login.html']");
    const username = localStorage.getItem("username");

    if (username) {
        navLink.textContent = "Signed in as "+ username;
        navLink.href = "#";
        navLink.style.display = "flex";
        navLink.style.flexDirection = "column";
        navLink.style.alignItems = "center";

        const signOutLink = document.createElement("a");
        signOutLink.href = "#";
        signOutLink.textContent = "Sign out";
        signOutLink.style.display = "block";
        signOutLink.style.justifyContent = "center"

        signOutLink.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("cart");
            location.reload();
        });

        navLink.appendChild(signOutLink);

        const rightNav = document.querySelector("#right-nav");

        if (rightNav && username=="admin") {
            const listItem = document.createElement("li")
            listItem.className = "nav-item";
            rightNav.appendChild(listItem);
            const addPage = document.createElement("a");
            addPage.href = "addition.html";
            addPage.textContent = "Add a Product";
            addPage.className = "nav-link";
            listItem.appendChild(addPage);
        }
    }

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
                        <span class="mx-2 qty">${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary increase" data-index="${index}">+</button>
                    </td>

                    <td>$${(item.price * item.quantity).toFixed(2)}</td>

                    <td>
                        <button class="btn btn-danger remove" data-index="${index}">X</button>
                    </td>
                </tr>
            `;
            grandTotal += item.price * item.quantity;
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
                cart[index].quantity++;
                saveAndReload();
            });
        });

        // Decrease Qty
        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", () => {
                let index = btn.dataset.index;
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
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
    
    function loadCheckoutModal() {
    let checkoutList = document.getElementById("checkout-list");
    let subtotalEl = document.getElementById("checkout-subtotal");
    let taxEl = document.getElementById("checkout-tax");
    let totalEl = document.getElementById("checkout-total");

    checkoutList.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        let row = `
            <li class="list-group-item d-flex justify-content-between">
                <div>${item.name} (x${item.quantity})</div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </li>
        `;
        subtotal += item.price * item.quantity;
        checkoutList.innerHTML += row;
    });

    let tax = subtotal * 0.13;  // 13% HST for Ontario (change if needed)
    let total = subtotal + tax;

    subtotalEl.textContent = subtotal.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);
}

const placeOrderBtn = document.getElementById("place-order-btn");

if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
        // Clear cart
        localStorage.removeItem("cart");

        // (Optional) Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
        if (modal) modal.hide();

        // Reload page to refresh cart
        location.reload();
    });
}
    
    const checkoutBtn = document.getElementById("open-checkout");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            loadCheckoutModal();
        });}
});
