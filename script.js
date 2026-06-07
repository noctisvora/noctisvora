const elements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

elements.forEach(el => observer.observe(el));

/* ================= HERO BUTTONS ================= */

document.getElementById("getStartedBtn")?.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("exploreBtn")?.addEventListener("click", () => {
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("joinBtn")?.addEventListener("click", () => {
    document.getElementById("team").scrollIntoView({ behavior: "smooth" });
});

/* ================= HERO CARD MEDIA DISPLAY ================= */

function displayHeroCardMedia() {
    const heroMedia = JSON.parse(localStorage.getItem("heroMedia") || "{}");
    
    const heroMappings = {
        thumbnail: "thumbnailCardMedia",
        revision: "revisionCardMedia",
        invitation: "invitationCardMedia"
    };
    
    Object.entries(heroMappings).forEach(([heroType, elementId]) => {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        const media = heroMedia[heroType] || [];
        container.innerHTML = "";
        
        if (media.length === 0) {
            container.style.display = "none";
            return;
        }
        
        container.style.display = "block";
        
        media.forEach((item) => {
            let mediaElement = "";
            if (item.type === "image") {
                mediaElement = `<div style="margin-bottom:15px; border-radius:8px; overflow:hidden; background:#1a1a24;">
                    <img src="${item.data}" alt="Card media" style="width:100%; height:auto; display:block; object-fit:contain;">
                </div>`;
            } else {
                mediaElement = `<div style="margin-bottom:15px; border-radius:8px; overflow:hidden;">
                    <video width="100%" height="auto" controls style="display:block; width:100%;"><source src="${item.data}" type="video/mp4"></video>
                </div>`;
            }
            container.innerHTML += mediaElement;
        });
    });
}

displayHeroCardMedia();

// Refresh hero card media every 5 seconds
setInterval(displayHeroCardMedia, 5000);

/* ================= CARD MEDIA DISPLAY ================= */

function displayCardMedia() {
    const cardMedia = JSON.parse(localStorage.getItem("cardMedia") || "{}");
    
    const cardMappings = {
        students: "studentsCardMedia",
        creators: "creatorsCardMedia",
        events: "eventsCardMedia"
    };
    
    Object.entries(cardMappings).forEach(([cardType, elementId]) => {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        const media = cardMedia[cardType] || [];
        container.innerHTML = "";
        
        if (media.length === 0) {
            container.style.display = "none";
            return;
        }
        
        container.style.display = "block";
        
        media.forEach((item) => {
            let mediaElement = "";
            if (item.type === "image") {
                mediaElement = `<div style="margin-bottom:15px; border-radius:8px; overflow:hidden; background:#1a1a24;">
                    <img src="${item.data}" alt="Card media" style="width:100%; height:auto; display:block; object-fit:contain;">
                </div>`;
            } else {
                mediaElement = `<div style="margin-bottom:15px; border-radius:8px; overflow:hidden;">
                    <video width="100%" height="auto" controls style="display:block; width:100%;"><source src="${item.data}" type="video/mp4"></video>
                </div>`;
            }
            container.innerHTML += mediaElement;
        });
    });
}

displayCardMedia();

// Refresh card media every 5 seconds
setInterval(displayCardMedia, 5000);

/* ================= MEDIA DISPLAY FOR INDEX ================= */

function displayUploadedMedia() {
    const mediaContainer = document.getElementById("mediaGallery");
    if (!mediaContainer) return;

    const media = JSON.parse(localStorage.getItem("uploadedMedia") || "[]");
    
    if (media.length === 0) {
        mediaContainer.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:#666;'>No media uploaded yet</p>";
        return;
    }

    mediaContainer.innerHTML = "";

    media.forEach((item) => {
        let mediaElement = "";
        if (item.type === "image") {
            mediaElement = `<img src="${item.data}" alt="Uploaded image" style="width:100%; height:auto; object-fit:contain; border-radius:12px;">`;
        } else if (item.type === "video") {
            mediaElement = `<video width="100%" height="auto" style="border-radius:12px; object-fit:contain;" controls><source src="${item.data}" type="video/mp4"></video>`;
        }

        mediaContainer.innerHTML += `
            <div style="background:#141420; border:1px solid rgba(255,255,255,0.06); border-radius:12px; overflow:hidden; transition:all 0.3s;">
                ${mediaElement}
                <div style="padding:12px;">
                    <p style="margin:0 0 5px; font-size:12px; color:#999;">📅 ${item.uploadedAt}</p>
                    <p style="margin:0; font-size:13px; word-break:break-word;">${item.name}</p>
                </div>
            </div>
        `;
    });
}

displayUploadedMedia();

// Refresh media gallery every 5 seconds to catch updates from admin panel
setInterval(displayUploadedMedia, 5000);

/* ================= FORM SUBMIT ================= */

const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const budget = document.getElementById("budget").value.trim();
        const project = document.getElementById("project").value.trim();

        // Validation
        if (!name || !email || !project) {
            alert("❌ Please fill in Name, Email, and Project Description");
            return;
        }

        if (!email.includes("@")) {
            alert("❌ Please enter a valid email address");
            return;
        }

        try {
            const res = await fetch("https://noctisvora.onrender.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    budget: budget || "Not specified",
                    project
                })
            });

            const data = await res.json();
            console.log("Response:", data);

            if (res.ok && data.success) {
                alert("🚀 Request Submitted Successfully!");
                console.log("✅ Request saved to backend");
                form.reset();
            } else if (res.ok && !data.success) {
                alert("⚠️ Request submitted but may not have saved. Please try again.");
                console.warn("Response not successful:", data);
            } else {
                alert("❌ Submission Failed: " + (data.message || "Unknown error"));
                console.error("HTTP Error:", res.status, data);
            }

        } catch (err) {
            console.error("Network Error:", err);
            alert("❌ Network Error - Backend may be down. Please try again later.");
        }
    });
}
