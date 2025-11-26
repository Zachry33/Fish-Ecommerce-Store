window.onload = function () {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const price = params.get("price");
    const img = params.get("img");
    const id = params.get("id"); 

    document.getElementById("prod-id").textContent = id || "0";
    document.getElementById("prod-name").textContent = name || "No name";
    document.getElementById("prod-price").textContent = "$" + (price || "0");
    document.getElementById("prod-img").src = img || "";


    document.getElementById("addToCartBtn").addEventListener("click", function () {

        let quantity = parseInt(document.getElementById("quantityInput").value);

        if (quantity < 1) quantity = 1;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];


        let existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity += quantity; 
        } else {
            cart.push({
                id: id,
                name: name,
                price: parseFloat(price),
                img: img,
                quantity: quantity
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Item added to cart!");
    });
};
