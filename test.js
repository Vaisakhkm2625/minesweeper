const textAreaSelector = "#outputBox"; // 👈 change this to your desired id/path
const apiUrl = "https://68a00fb500196a4351af.fra.appwrite.run/";

document.addEventListener("keydown", async function (e) {
    if (e.ctrlKey && e.key === "k") {
        e.preventDefault();

        const selection = window.getSelection().toString().trim();
        if (!selection) {
            alert("No text selected!");
            return;
        }

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: selection })
            });

            const data = await res.json();
            const textArea = document.querySelector(textAreaSelector);

            if (textArea) {
                textArea.value = data.completion || "No completion received.";
            } else {
                alert("Textarea not found: " + textAreaSelector);
            }
        } catch (err) {
            console.error(err);
            const textArea = document.querySelector(textAreaSelector);
            if (textArea) textArea.value = "Error fetching completion.";
        }
    }
});
