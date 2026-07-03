const Popup = {
    currentReply: "",
    isGenerating: false,

    create() {
        const existing = document.getElementById("ai-popup");
        if (existing) existing.remove();

        const popup = document.createElement("div");
        popup.id = "ai-popup";

        popup.innerHTML = `
            <div class="ai-popup-header">
                <span class="header-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>
                    </svg>
                    Reply Assistant
                </span>
                <button id="close-popup" title="Close (Esc)">&times;</button>
            </div>
            <div class="ai-popup-body">
                <label>Tone</label>
                <select id="tone">
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Casual</option>
                </select>

                <label>Length</label>
                <select id="length">
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Long</option>
                </select>

                <button id="generate-btn">Generate Reply</button>

                <textarea
                    id="generated-reply"
                    placeholder="Your reply will appear here..."
                ></textarea>
                <div class="char-counter"><span id="char-count">0</span> characters</div>

                <div class="popup-actions">
                    <button id="regenerate-btn" disabled>Regenerate</button>
                    <button id="copy-btn" disabled>Copy</button>
                    <button id="insert-btn" disabled>Insert</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        this.attachEvents();
    },

    setGenerating(isGenerating) {
        this.isGenerating = isGenerating;
        const btn = document.getElementById("generate-btn");
        const regenBtn = document.getElementById("regenerate-btn");
        btn.disabled = isGenerating;
        btn.innerHTML = isGenerating
            ? `<span class="spinner"></span> Generating...`
            : "Generate Reply";
        regenBtn.disabled = isGenerating || !this.currentReply;
    },

    updateCharCount() {
        const textarea = document.getElementById("generated-reply");
        document.getElementById("char-count").textContent = textarea.value.length;
    },

    async handleGenerate() {
        if (this.isGenerating) return;

        const tone = document.getElementById("tone").value;
        const length = document.getElementById("length").value;
        const emailContent = Gmail.getEmailContent();
        const textarea = document.getElementById("generated-reply");

        this.setGenerating(true);
        textarea.value = "Generating...";

        try {
            const reply = await API.generateReply(emailContent, tone, length);
            this.currentReply = reply;
            textarea.value = reply;
            this.updateCharCount();

            document.getElementById("copy-btn").disabled = false;
            document.getElementById("insert-btn").disabled = false;
        } catch (e) {
            textarea.value = "Failed to generate reply.";
        } finally {
            this.setGenerating(false);
        }
    },

    attachEvents() {
        const popup = document.getElementById("ai-popup");

        document.getElementById("close-popup").onclick = () => popup.remove();
        document.getElementById("generate-btn").onclick = () => this.handleGenerate();
        document.getElementById("regenerate-btn").onclick = () => this.handleGenerate();

        document.getElementById("generated-reply").addEventListener("input", (e) => {
            this.currentReply = e.target.value;
            this.updateCharCount();
        });

        document.getElementById("copy-btn").onclick = async (e) => {
            await navigator.clipboard.writeText(this.currentReply);
            const btn = e.currentTarget;
            const original = btn.textContent;
            btn.textContent = "Copied";
            setTimeout(() => (btn.textContent = original), 1500);
        };

        document.getElementById("insert-btn").onclick = (e) => {
            Gmail.insertReply(this.currentReply);
            const btn = e.currentTarget;
            const original = btn.textContent;
            btn.textContent = "Inserted";
            setTimeout(() => (btn.textContent = original), 1500);
        };

        this._escHandler = (e) => {
            if (e.key === "Escape") popup.remove();
        };
        document.addEventListener("keydown", this._escHandler);

        this._outsideClickHandler = (e) => {
            if (!popup.contains(e.target) && !e.target.closest(".ai-reply-btn")) {
                popup.remove();
            }
        };
        setTimeout(() => {
            document.addEventListener("click", this._outsideClickHandler);
        }, 0);
    },
};