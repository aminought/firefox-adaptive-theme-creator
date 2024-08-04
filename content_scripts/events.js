const notifyBackground = (e) => {
  browser.runtime.sendMessage({
    event: e.type,
    y: document.documentElement.scrollTop,
  });
};

document.addEventListener("scrollend", notifyBackground);
document.addEventListener("click", (e) =>
  setTimeout(() => notifyBackground(e), 300)
);
