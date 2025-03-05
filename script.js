const socket = io("https://ai-image-generator-nk60.onrender.com");

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
        // 🔹 Trigger WebSocket for real-time image generation
        socket.emit("request-image", prompt);

        socket.on("status", (data) => {
            if (data.status === "generating") {
                loadingElement.innerText = "Generating Image...";
            }
        });

        socket.on("image-response", (data) => {
            if (data.status === "success" && data.image) {
                imageElement.style.opacity = 0;
                imageElement.src = data.image;
                imageElement.classList.remove("hidden");

                setTimeout(() => {
                    imageElement.style.opacity = 1;
                }, 100);
            } else {
                alert("Failed to generate image. Try again.");
            }
            loadingElement.classList.add("hidden");
        });
    } catch (error) {
        alert("Error generating image. Please check the backend.");
        console.error(error);
        loadingElement.classList.add("hidden");
    }
}
