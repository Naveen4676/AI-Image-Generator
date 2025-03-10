async function generateImage() {
    const prompt = document.getElementById("prompt").value;
    const imageElement = document.getElementById("generatedImage");
    const loadingElement = document.getElementById("loading");

    if (!prompt.trim()) {
        alert("Please enter an image description.");
        return;
    }

    // Hide previous image and show loading animation
    imageElement.classList.add("hidden");
    loadingElement.classList.remove("hidden");

    try {
        // ✅ Use FormData instead of JSON
        const formData = new FormData();
        formData.append("prompt", prompt);

        const response = await fetch("https://ai-image-generator-nk60.onrender.com/generate-image", {
            method: "POST",
            body: formData, // ✅ Sending multipart/form-data
        });

        const data = await response.json();
        if (data.image) {
            imageElement.style.opacity = 0;
            imageElement.src = data.image;
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

// ✅ Fix 'Enter' key trigger
document.getElementById("prompt").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        generateImage();
    }
});
