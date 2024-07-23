export class ContextMenu {
  constructor() {
    this.menu = document.getElementById("context_menu");
    this.title = document.getElementById("context_menu_title");
    this.saturationLimitEnabled = document.querySelector(
      ".custom_saturation_limit_enabled"
    );
    this.saturationLimit = document.querySelector(".custom_saturation_limit");
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

  fillSaturationLimitEnabled(part, value) {
    const saturationLimitEnabled = this.saturationLimitEnabled.cloneNode(true);
    const parent = this.saturationLimitEnabled.parentNode;

    const key = `${part}.saturation_limit.enabled`;
    saturationLimitEnabled.id = key;
    saturationLimitEnabled.name = key;
    saturationLimitEnabled.checked = value;

    parent.removeChild(this.saturationLimitEnabled);
    parent.appendChild(saturationLimitEnabled);
    this.saturationLimitEnabled = saturationLimitEnabled;
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
}
