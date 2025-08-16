document.title = "Online test window"
document.addEventListener("keydown", async function (e) {
    if (e.ctrlKey && e.key === ";") {
        e.preventDefault();

        const selection = window.getSelection().toString().trim();
        if (!selection) {
            alert("No text selected!");
            return;
        }

        try {
            const res = await fetch("https://68a00fb500196a4351af.fra.appwrite.run/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: selection })
            });

            const data = await res.json();
            const completion = data.completion || "No completion received.";

            // Try CKEditor 4
            if (window.CKEDITOR) {
                for (const editorName in window.CKEDITOR.instances) {
                    const editor = window.CKEDITOR.instances[editorName];
                    editor.insertText(completion);
                    return;
                }
                alert("No CKEditor 4 instances found.");
                return;
            }

            // Try CKEditor 5
            const editors = document.querySelectorAll(".ck-editor__editable");
            if (editors.length > 0) {
                editors.forEach(element => {
                    const editorInstance = element.ckeditorInstance;
                    if (editorInstance) {
                        editorInstance.model.change(writer => {
                            const insertPosition = editorInstance.model.document.selection.getFirstPosition();
                            writer.insertText(completion, insertPosition);
                        });
                    }
                });
                if (!Array.from(editors).some(el => el.ckeditorInstance)) {
                    alert("No CKEditor 5 instances found.");
                }
                return;
            }

            alert("No CKEditor instances found on this page.");
        } catch (err) {
            console.error(err);
            const errorMessage = "Error fetching completion.";

            // Try CKEditor 4 for error message
            if (window.CKEDITOR) {
                for (const editorName in window.CKEDITOR.instances) {
                    const editor = window.CKEDITOR.instances[editorName];
                    editor.insertText(errorMessage);
                    return;
                }
                alert("No CKEditor 4 instances found.");
                return;
            }

            // Try CKEditor 5 for error message
            const editors = document.querySelectorAll(".ck-editor__editable");
            if (editors.length > 0) {
                editors.forEach(element => {
                    const editorInstance = element.ckeditorInstance;
                    if (editorInstance) {
                        editorInstance.model.change(writer => {
                            const insertPosition = editorInstance.model.document.selection.getFirstPosition();
                            writer.insertText(errorMessage, insertPosition);
                        });
                    }
                });
                if (!Array.from(editors).some(el => el.ckeditorInstance)) {
                    alert("No CKEditor 5 instances found.");
                }
                return;
            }

            alert("No CKEditor instances found on this page.");
        }
    }
});
