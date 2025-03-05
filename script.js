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
        // 🔹 Replace with your actual Render backend API URL
        const response = await fetch("https://ai-image-generator-nk60.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

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
        alert("Error generating image. Please check the backend.");
        console.error(error);
    } finally {
        loadingElement.classList.add("hidden");
    }
}
