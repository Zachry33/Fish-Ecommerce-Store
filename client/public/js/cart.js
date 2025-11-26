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
            location.reload();
        });

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
});
