const OPTIONS = [
  "saturationLimit",
  "changeDefaultTabColors",
  "defaultTabBgColor",
  "defaultTabFgColor",
];

const form = document.getElementById("options");

const toggleDefaultTabColors = () => {
  const defaultTabColors = document.getElementById("defaultTabColors");
  const checkbox = document.getElementById("changeDefaultTabColors");
  defaultTabColors.classList.toggle("hidden", !checkbox.checked);
};

const getOption = (id) => {
  if (form[id].type === "checkbox") {
    return form[id].checked;
  }
  return form[id].value;
};

const setOption = (id, value) => {
  if (form[id].type === "checkbox") {
    form[id].checked = value;
  } else {
    form[id].value = value;
  }
};

const saveOptions = (e) => {
  e.preventDefault();
  const options = {};
  for (const id of OPTIONS) {
    options[id] = getOption(id);
  }
  browser.storage.sync.set(options).then(() => {
    browser.runtime.sendMessage({ event: "optionsUpdated" });
  });
};

const resetOptions = (e) => {
  e.preventDefault();
  form.reset();
  toggleDefaultTabColors();
  saveOptions(e);
};

const restoreOptions = () => {
  browser.storage.sync.get().then((options) => {
    for (const [name, value] of Object.entries(options)) {
      setOption(name, value);
    }
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#options").addEventListener("submit", saveOptions);
document.querySelector("#reset-button").addEventListener("click", resetOptions);
document
  .querySelector("#changeDefaultTabColors")
  .addEventListener("click", toggleDefaultTabColors);
