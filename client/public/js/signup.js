document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const email = emailInput.value.trim();

        // Make sure they entered the form
        if (!username || !password || !email) {
            alert("Please enter username, email and password.");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email })
            });

            if (res.ok) {
                alert("Signup successful! You can now log in.");
                window.location.href = "login.html";
            }
            else {
                alert("Error: " + result.error);
            }

        } catch (err) {
            console.error(err);
            alert("Something went wrong. Try again.");
        }
    });
});