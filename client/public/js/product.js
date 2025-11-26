window.onload = function () {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const price = params.get("price");
    const img = params.get("img");

    document.getElementById("prod-name").textContent = name || "No name";
    document.getElementById("prod-price").textContent = "$" + (price || "0");

    document.getElementById("prod-img").src = img || "";
}