window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const messages = document.getElementById("messages");
    if (messages) messages.remove();
  }
});
