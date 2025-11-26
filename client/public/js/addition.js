document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("productForm");
    const titleInput = document.getElementById("title");
    const desInput = document.getElementById("des");
    const imgURLInput = document.getElementById("img-url");
    const priceInput = document.getElementById("price");
    const stockInput = document.getElementById("stock");


    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const description = desInput.value.trim();
        const image_id = imgURLInput.value.trim();
        const price = Number(priceInput.value.trim());
        const stock = Number(stockInput.value.trim());

        const token = localStorage.getItem("session_token");

        // Make sure they entered the form
        if (!title || !description || !image_id || !price || !stock) {
            alert("Please fill out the form");
            return;
        }
        else if(price==NaN || price<0) {
            alert("Please enter a valid price");
            return;
        }
        else if (stock==NaN || stock<0) {
            alert("Please enter a valid stock");
            return;
        }

        try {
            const res = await fetch("/api/addproduct", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            "fishy-token": token
                },
                body: JSON.stringify({ title, description, price, image_id, stock })
            });

            if (!res.ok) {
                const msg = await res.text();
                alert(msg);
                return;
            }
            // Redirect to homepage
            window.location.href = "index.html";

        } catch (err) {
            console.error(err);
            alert("An error occured. Please try again.");
        }
    });
});