const OPTIONS = ["saturationLimit", "changeDefaultTabColors", "defaultTabBgColor", "defaultTabFgColor"];

const form = document.getElementById("options");

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#options").addEventListener("submit", saveOptions);
document.querySelector("#reset-button").addEventListener("click", resetOptions);
document.querySelector("#changeDefaultTabColors").addEventListener("click", toggleDefaultTabColors);

function toggleDefaultTabColors() {
  const defaultTabColors = document.getElementById("defaultTabColors");
  const checkbox = document.getElementById("changeDefaultTabColors");
  defaultTabColors.classList.toggle("hidden", !checkbox.checked);
}

function getOption(id) {
  if (form[id].type === "checkbox") {
    return form[id].checked;
  }
  return form[id].value;
}

function setOption(id, value) {
  if (form[id].type === "checkbox") {
    form[id].checked = value;
  } else {
    form[id].value = value;
  }
}

function saveOptions(e) {
  e.preventDefault();
  let options = {};
  for (let id of OPTIONS) {
    options[id] = getOption(id);
  }
  browser.storage.sync.set(options).then(() => {
    browser.runtime.sendMessage({"event": "optionsUpdated"});
  });
}

function resetOptions(e) {
  e.preventDefault();
  form.reset();
  toggleDefaultTabColors();
  saveOptions(e);
}

function restoreOptions() {
  browser.storage.sync.get().then(options => {
    for (let [name, value] of Object.entries(options)) {
      setOption(name, value);
    }
  });
}
