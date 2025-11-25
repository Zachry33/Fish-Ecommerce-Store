document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Make sure they entered the form
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const msg = await res.text();
                alert(msg);
                return;
            }

            // Backend returns plain 
            const token = await res.text();
            console.log("Token:", token);

            // Save session
            localStorage.setItem("session_token", token);

            // Redirect to homepage
            window.location.href = "index.html";

        } catch (err) {
            console.error(err);
            alert("An error occured. Please try again.");
        }
    });
});