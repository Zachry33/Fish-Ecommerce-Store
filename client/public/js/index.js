document.addEventListener('DOMContentLoaded', function() {
    const searchValue = document.getElementById("search-value");
    document.getElementById('search-button').addEventListener('click', async function (e) {
        if (searchValue.value=="") {
            searchValue.value="*";
        }
        const res = await fetch(`http://localhost:6741/api/catalog?query=${searchValue.value}`);
        searchValue.value="";
        if (!res.ok) {
            const text = await res.text();
            throw new Error("Server error: " + text);
        }

        const products = await res.json();
        loadProducts(products);
    });
});

document.addEventListener("DOMContentLoaded", async (event) => {
    const res = await fetch('http://localhost:6741/api/catalog?query=*');

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Server error: " + text);
    }

    const products = await res.json();
    loadProducts(products);
});

function loadProducts(products) {
    let rowHTML = "";
    products.forEach((product, index) => {
        if(index%3==0){
            if(index!=0){
                rowHTML += `</div>\n`;
            }
            rowHTML += `<div class="pro-container row pt-5">\n`;
        }
        rowHTML += `
                <div class="pro col-sm-4">\n
                <img src="images/${product.image_id}" alt="">\n
                    <div class="des">\n
                        <h5>${product.title}</h5>\n
                        <h4>$${product.price}</h4>\n
                        <a href="product.html?name=${product.title}&price=${product.price}&img=images/${product.image_id}&stock=${product.stock}&description=${product.description}" class="btn">\n
                            <i class="bi bi-bag"></i>\n
                        </a>\n
                    </div>\n
                </div>\n`;
    });
    document.getElementById("products").innerHTML=rowHTML;
}



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