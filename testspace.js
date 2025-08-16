// Configuration object for easy customization
const CONFIG = {
    API_URL: "https://68a00fb500196a4351af.fra.appwrite.run/",
    TITLE_REVERT_TIMEOUT: 5000,
    ORIGINAL_TITLE: "Online test window"
};

// Flag to prevent multiple simultaneous API calls
let isProcessing = false;

document.title = CONFIG.ORIGINAL_TITLE;

document.addEventListener("keydown", async function (e) {
    if (e.ctrlKey && e.key === ";" && !isProcessing) {
        e.preventDefault();
        isProcessing = true;

        const selection = window.getSelection().toString().trim();
        if (!selection) {
            insertErrorToEditor("No text selected!");
            isProcessing = false;
            return;
        }

        try {
            const res = await fetch(CONFIG.API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: selection })
            });

            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }

            const data = await res.json();
            const completion = sanitizeText(data.completion || "No completion received.");

            // Try CKEditor 4
            if (window.CKEDITOR && insertToCKEditor4(completion)) {
                isProcessing = false;
                return;
            }

            // Try CKEditor 5
            if (insertToCKEditor5(completion)) {
                isProcessing = false;
                return;
            }

            // Fallback to textarea or contenteditable
            if (insertToActiveElement(completion)) {
                isProcessing = false;
                return;
            }

            setTemporaryTitle("No editable elements found on this page.");
        } catch (err) {
            console.error("Error fetching completion:", err);
            insertErrorToEditor(`Error: ${err.message}`);
        } finally {
            isProcessing = false;
        }
    }
});

// Sanitize text to prevent XSS
function sanitizeText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Insert text into CKEditor 4
function insertToCKEditor4(text) {
    if (!window.CKEDITOR) return false;
    for (const editorName in window.CKEDITOR.instances) {
        const editor = window.CKEDITOR.instances[editorName];
        editor.insertText(text);
        return true;
    }
    setTemporaryTitle("No CKEditor 4 instances found.");
    return false;
}

// Insert text into CKEditor 5
function insertToCKEditor5(text) {
    const editors = document.querySelectorAll(".ck-editor__editable");
    if (editors.length === 0) return false;

    let inserted = false;
    editors.forEach(element => {
        const editorInstance = element.ckeditorInstance;
        if (editorInstance) {
            editorInstance.model.change(writer => {
                const insertPosition = editorInstance.model.document.selection.getFirstPosition();
                writer.insertText(text, insertPosition);
            });
            inserted = true;
        }
    });

    if (!inserted) {
        setTemporaryTitle("No CKEditor 5 instances found.");
    }
    return inserted;
}

// Fallback: Insert text into active textarea or contenteditable
function insertToActiveElement(text) {
    const activeElement = document.activeElement;
    if (activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable) {
        if (activeElement.tagName === "TEXTAREA") {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
        } else {
            document.execCommand("insertText", false, text);
        }
        return true;
    }
    return false;
}

// Insert error messages into an editor or show in title
function insertErrorToEditor(errorMessage) {
    if (insertToCKEditor4(errorMessage)) return;
    if (insertToCKEditor5(errorMessage)) return;
    if (insertToActiveElement(errorMessage)) return;
    setTemporaryTitle("No editable elements found on this page.");
}

// Temporarily change the page title and revert after timeout
function setTemporaryTitle(newTitle) {
    document.title = newTitle;
    setTimeout(() => {
        document.title = CONFIG.ORIGINAL_TITLE;
    }, CONFIG.TITLE_REVERT_TIMEOUT);
}
