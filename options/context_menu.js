export class ContextMenu {
  constructor() {
    this.menu = document.getElementById("context_menu");
    this.title = document.getElementById("context_menu_title");
    this.customEnabled = document.querySelector(".custom_enabled");
    this.saturationLimit = document.querySelector(".custom_saturation_limit");
    this.darken = document.querySelector(".custom_darken");
    this.brighten = document.querySelector(".custom_brighten");
  }

  isOpened() {
    return !this.menu.classList.contains("hidden");
  }

  open() {
    this.menu.classList.toggle("hidden", false);
  }

  close() {
    this.menu.classList.toggle("hidden", true);
  }

  positionInside = (parent, clientX, clientY) => {
    const menuRect = this.menu.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    this.menu.style.top = `${clientY}px`;
    if (clientX + menuRect.width > parentRect.right) {
      this.menu.style.left = `${clientX - menuRect.width}px`;
    } else {
      this.menu.style.left = `${clientX}px`;
    }
  };

  fillTitle(part) {
    this.title.innerHTML = part;
  }

  fillCustomEnabled(part, value) {
    const customEnabled = this.customEnabled.cloneNode(true);
    const parent = this.customEnabled.parentNode;

    const key = `${part}.custom_enabled`;
    customEnabled.id = key;
    customEnabled.name = key;
    customEnabled.checked = value;

    parent.removeChild(this.customEnabled);
    parent.appendChild(customEnabled);
    this.customEnabled = customEnabled;
  }

  fillSaturationLimit(part, value) {
    const saturationLimit = this.saturationLimit.cloneNode(true);
    const parent = this.saturationLimit.parentNode;

    const key = `${part}.saturation_limit`;
    saturationLimit.id = key;
    saturationLimit.name = key;
    saturationLimit.value = value;

    parent.removeChild(this.saturationLimit);
    parent.appendChild(saturationLimit);
    this.saturationLimit = saturationLimit;
  }

  fillDarken(part, value) {
    const darken = this.darken.cloneNode(true);
    const parent = this.darken.parentNode;

    const key = `${part}.darken`;
    darken.id = key;
    darken.name = key;
    darken.value = value;

    parent.removeChild(this.darken);
    parent.appendChild(darken);
    this.darken = darken;
  }

  fillBrighten(part, value) {
    const brighten = this.brighten.cloneNode(true);
    const parent = this.brighten.parentNode;

    const key = `${part}.brighten`;
    brighten.id = key;
    brighten.name = key;
    brighten.value = value;

    parent.removeChild(this.brighten);
    parent.appendChild(brighten);
    this.brighten = brighten;
  }
}
