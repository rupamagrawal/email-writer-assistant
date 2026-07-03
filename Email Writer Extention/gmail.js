const Gmail = {
  findComposeBox() {
    return document.querySelector(
      'div[role="textbox"][contenteditable="true"]',
    );
  },

  findSendButton() {
    const buttons = [...document.querySelectorAll('div[role="button"]')];

    return buttons.find((button) => button.innerText.trim() === "Send");
  },

  getEmailContent() {
    const selectors = [".a3s.aiL", ".gmail_quote", ".ii.gt", ".h7"];

    for (const selector of selectors) {
      const email = document.querySelector(selector);

      if (email && email.innerText.trim()) {
        return email.innerText.trim();
      }
    }

    return "";
  },

  insertReply(reply) {
    const composeBox = this.findComposeBox();

    if (!composeBox) {
      alert("Compose box not found.");

      return;
    }

    composeBox.focus();

    document.execCommand("insertText", false, reply);
  },
};
