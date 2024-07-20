const options = new Options();
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

const restoreOptions = () => {
  for (const key of options.keys()) {
    setOption(key, options.get(key));
  }
};

const saveOptions = async (e) => {
  e.preventDefault();
  for (const key of options.keys()) {
    options.set(key, getOption(key));
  }
  await options.save();
};

const resetOptions = async (e) => {
  e.preventDefault();
  options.init();
  await options.save();
  restoreOptions();
  toggleDefaultTabColors();
};

document.addEventListener("DOMContentLoaded", async () => {
  await options.load();
  restoreOptions();
  document.querySelector("#options").addEventListener("submit", saveOptions);
  document.querySelector("#reset-button").addEventListener("click", resetOptions);
  document
    .querySelector("#changeDefaultTabColors")
    .addEventListener("click", toggleDefaultTabColors);
});

