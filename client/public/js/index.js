document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-button').
                addEventListener('click', function () {
                   // Add search page
                   console.log("hi");
                });
});

document.addEventListener("DOMContentLoaded", async (event) => {
    const res = await fetch('http://localhost:6741/api/catalog?query=*');

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Server error: " + text);
    }

    const products = await res.json();
    console.log(products);
});

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

    
    function loadProducts() {
        productbody.innerHTML = "";
        let rowHTML = "";
        products.forEach((product, index) => {
            if(index%3==0){
                if(index!=0){
                    rowHTML += `</div>`;
                }
                rowHTML += `<div class="pro-container row">`;
            }
            rowHTML += `
            <div class="pro-container row">
                <div class="pro col-sm-4">
                <img src="images/${product.image_id}" alt="">
                    <div class="des">
                        <h5>${product.title}</h5>
                        <h4>$${product.price}</h4>
                        <a href="product.html?name=${product.title}&price=${product.price}&img=images/${product.image_id}"&stock=${product.stock}&description=${product.description} class="btn">
                            <i class="bi bi-bag"></i>
                        </a>
                    </div>
                </div>
            </div>`;
        });
    }

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