const textAreaSelector = "div:nth-of-type(1) > div.main-body.app-container > div:nth-of-type(2) > div:nth-of-type(3) > div.question-card.position-relative.border-0.rounded-bottom-0.tw-height.border-bottom-0.card > div.py-0.h-100.px-3.card-body:nth-of-type(2) > div.position-relative.h-100:nth-of-type(1) > div.h-100:nth-of-type(2) > div.position-relative.h-100.pt-lg-2.pt-0 > div.h-100.row:nth-of-type(2) > div.pl-lg-5.pr-lg-0.px-3.py-4.overflow-y.content-overflow-height.border-lg-left.col-md-6:nth-of-type(2) > div.bg-white-opacity > div.py-4.pr-lg-5:nth-of-type(2) > div.ck.ck-reset.ck-editor.ck-rounded-corners:nth-of-type(2) > div.ck.ck-editor__main:nth-of-type(2) > div.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline"; 
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
