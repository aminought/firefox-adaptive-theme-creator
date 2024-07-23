export class BrowserPreview {
  constructor() {
    this.mock = document.getElementById("browser_preview");
    this.appcontent = document.getElementById("appcontent");
    this.popup = document.getElementById("popup");
  }

  static colorPart(part, color) {
    const element = document.getElementById(part);
    element.style.backgroundColor = color?.css();
  }

  static markChanged(part, value) {
    const element = document.getElementById(part);
    element.classList.toggle('changed', value);
  }

  showPopup() {
    this.popup.classList.toggle("hidden", false);
  }

  hidePopup() {
    this.popup.classList.toggle("hidden", true);
  }

  showRickroll() {
    this.hidePopup();
    const img = document.createElement("img");
    img.id = "rickroll";
    img.src = `https://raw.githubusercontent.com/aminought/storage/main/egg.gif`;
    this.appcontent.appendChild(img);
  }

  hideRickroll(img) {
    this.appcontent.removeChild(img);
    this.showPopup();
  }

  rickroll() {
    const img = document.getElementById("rickroll");
    if (img) {
      this.hideRickroll(img);
    } else {
      this.showRickroll();
    }
  }

  onClick(callback) {
    this.mock.addEventListener("click", callback);
  }

  onContextMenu(callback) {
    this.mock.addEventListener("contextmenu", callback);
  }
}
