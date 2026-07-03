console.log("Email Writer Extension Loaded");

function createAIButton() {
  const button = document.createElement("div");

  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";

  button.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="vertical-align:-2px; margin-right:6px;">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>
    </svg>
    AI Reply
  `;

  button.title = "Generate AI Reply";

  return button;
}

function injectButton() {
  const sendButton = Gmail.findSendButton();

  if (!sendButton) return;

  if (document.querySelector(".ai-reply-btn")) {
    return;
  }

  const button = createAIButton();

  button.classList.add("ai-reply-btn");

  button.addEventListener("click", () => {
    Popup.create();
  });

  sendButton.parentElement.insertBefore(button, sendButton);
}

const observer = new MutationObserver(() => {
  injectButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

injectButton();