async function generateImage() {
    const prompt = document.getElementById("prompt").value;
    const imageElement = document.getElementById("generatedImage");
    const loadingElement = document.getElementById("loading");

    if (!prompt) {
        alert("Please enter an image description.");
        return;
    }

    // Hide previous image and show loading animation
    imageElement.classList.add("hidden");
    loadingElement.classList.remove("hidden");

    try {
        const response = await fetch("https://ai-image-generator-nk60.onrender.com/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        const text = await response.text(); // Read response as text first
        try {
            const data = JSON.parse(text); // Try parsing as JSON
            if (data.image_url) {
                imageElement.style.opacity = 0;
                imageElement.src = data.image_url;
                imageElement.classList.remove("hidden");

                setTimeout(() => {
                    imageElement.style.opacity = 1;
                }, 100);
            } else {
                alert("Failed to generate image. Try again.");
            }
        } catch (error) {
            console.error("Invalid JSON response:", text);
            alert("Unexpected server response. Check console.");
        }
    } catch (error) {
        alert("Error generating image. Please check the backend.");
        console.error(error);
    } finally {
        loadingElement.classList.add("hidden");
    }
}

// ✅ Add 'Enter' key event listener
document.getElementById("prompt").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission if inside a form
        generateImage();
    }
});
