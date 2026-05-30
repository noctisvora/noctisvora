const elements = document.querySelectorAll('.hidden');

/* ================= ANIMATION ================= */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

elements.forEach(el => observer.observe(el));

/* ================= FORM SUBMIT ================= */

const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const budget = document.getElementById("budget").value;
        const project = document.getElementById("project").value;

        try {
            const res = await fetch("https://noctisvora.onrender.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    budget,
                    project
                })
            });

            const data = await res.json();
            console.log("Response:", data);

            if (data.success) {
                alert("🚀 Request Submitted Successfully!");
                form.reset();
            } else {
                alert(data.message || "❌ Submission Failed");
            }

        } catch (err) {
            console.log("ERROR:", err);
            alert("❌ Server Error");
        }
    });
}
