const options = new Options();
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

const restoreOptions = () => {
  for (const key of options.keys()) {
    if (key in form) {
      setOption(key, options.get(key));
    }
  }
};

const saveOptions = async (e) => {
  e.preventDefault();
  for (const key of options.keys()) {
    if (key in form) {
      options.set(key, getOption(key));
    }
  }
  await options.save();
};

const resetOptions = async (e) => {
  e.preventDefault();
  options.init();
  await options.save();
  restoreOptions();
};

document.addEventListener("DOMContentLoaded", async () => {
  await options.load();
  restoreOptions();
  document.querySelector("#options").addEventListener("change", saveOptions);
  document.querySelector("#reset-button").addEventListener("click", resetOptions);
});

