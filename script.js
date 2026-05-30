const elements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
});

elements.forEach(el => observer.observe(el));
document.querySelector("form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const budget = document.getElementById("budget").value;

    const project = document.getElementById("project").value;

    const res = await fetch("https://noctisvora.onrender.com", {

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

    alert(await res.text());

});
