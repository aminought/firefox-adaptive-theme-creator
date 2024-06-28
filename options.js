document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#options-form").addEventListener("submit", saveOptions);
document.querySelector("#reset-button").addEventListener("click", resetOptions);

function saveOptions(e) {
  e.preventDefault();
  const form = document.querySelector("#options-form");
  const formData = new FormData(form);
  const options = Object.fromEntries(formData);
  browser.storage.sync.set(options);
}

function resetOptions(e) {
  e.preventDefault();
  const form = document.querySelector("#options-form");
  form.reset();
  saveOptions(e);
}

function restoreOptions() {
  browser.storage.sync.get().then(options => {
    const form = document.querySelector("#options-form");
    for (let [name, value] of Object.entries(options)) {
      form.querySelector(`[id="${name}"]`).value = value;
    }
  });
}
