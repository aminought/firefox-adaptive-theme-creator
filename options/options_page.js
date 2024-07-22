import { Options } from "./options.js";

const form = document.getElementById("options");

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

const restoreOptions = (options) => {
  for (const key of options.keys()) {
    if (key in form) {
      setOption(key, options.get(key));
    }
  }
};

const saveOptions = async (e, options) => {
  e.preventDefault();
  for (const key of options.keys()) {
    if (key in form) {
      options.set(key, getOption(key));
    }
  }
  await options.save();
};

const resetOptions = async (e, options) => {
  e.preventDefault();
  options.reset();
  await options.save();
  restoreOptions(options);
};

const addSaturationLimitOptions = () => {
  const select = document.querySelector("#saturationLimit");
  for (let i = 0.1; i <= 1.0; i += 0.1) {
    const option = document.createElement("option");
    option.value = i.toFixed(1);
    option.label = option.value;
    select.appendChild(option);
  }
};

const setColor = (property, color) => {
  document.documentElement.style.setProperty(property, color);
};

const styleOptions = async () => {
  const theme = await browser.theme.getCurrent();
  if (!theme.colors) {
    return;
  }
  setColor("--background-color", theme.colors.popup);
  setColor("--color", theme.colors.popup_text);
};

document.addEventListener("DOMContentLoaded", async () => {
  const options = await Options.load();
  addSaturationLimitOptions();
  styleOptions();
  restoreOptions(options);
  document
    .querySelector("#options")
    .addEventListener("change", (e) => saveOptions(e, options));
  document
    .querySelector("#reset-button")
    .addEventListener("click", (e) => resetOptions(e, options));
});
