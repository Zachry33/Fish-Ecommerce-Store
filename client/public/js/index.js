document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-button').
                addEventListener('click', function () {
                   // Add search page
                   console.log("hi");
                });
});

document.addEventListener("DOMContentLoaded", () => {
    let buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            let product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                img: btn.dataset.image,
                qty: 1
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Check if item is already in cart
            let existing = cart.find(item => item.id === product.id);

            if (existing) {
                existing.qty++;
            } else {
                cart.push(product);
            }

            // Save cart
            localStorage.setItem("cart", JSON.stringify(cart));

            // Optional: visual confirmation popup
            alert(product.name + " added to cart!");
        });
    });
});