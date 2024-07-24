export class Form {
  constructor() {
    this.form = document.getElementById("options");
  }

  getValue(key) {
    if (this.form[key].type === "checkbox") {
      return this.form[key].checked;
    }
    return this.form[key].value;
  }

  setValue(key, value) {
    if (this.form[key].type === "checkbox") {
      this.form[key].checked = value;
    } else {
      this.form[key].value = value;
    }
  }

  import(options) {
    for (const key of options.keys()) {
      if (key in this.form) {
        this.setValue(key, options.get(key));
      }
    }
  }

  export(options) {
    for (const key of options.keys()) {
      if (key in this.form) {
        options.set(key, this.getValue(key));
      }
    }
  }

  onChange(callback) {
    this.form.addEventListener("change", callback);
  }
}
