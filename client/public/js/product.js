window.onload = function () {
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

    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const price = params.get("price");
    const img = params.get("img");
    const id = params.get("id");
    const description = params.get("description");
    const stock = params.get("stock");

    document.getElementById("prod-id").textContent = "Fish";
    document.getElementById("prod-name").textContent = name || "No name";
    document.getElementById("prod-price").textContent = "$" + (price || "0");
    document.getElementById("prod-img").src = img || "";
    document.getElementById("prod-description").textContent =  (description || "Unvailiable at this time");
    stockNode = document.getElementById("prod-stock");
    if (stock < 1) {
        stockNode.textContent = "Out of Stock";
        stockNode.className = "text-danger";
    }
    else {
        stockNode.textContent = "In Stock (" + stock +" units)";
    }
    
    


    document.getElementById("addToCartBtn").addEventListener("click", function () {

        let quantity = parseInt(document.getElementById("quantityInput").value);

        if (quantity < 1) quantity = 1;

        if (quantity>stock) {
            alert("Not enough inventory");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];


        let existing = cart.find(item => item.name === name);

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
