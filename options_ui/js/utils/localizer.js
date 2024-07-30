export class Localizer {
  static localizePage() {
    const elements = document.querySelectorAll("[data-i18n]");
    for (const element of elements) {
      const messageName = element.getAttribute("data-i18n");
      element.innerHTML = Localizer.getMessage(messageName);
    }
  }

  static getMessage(messageName) {
    return browser.i18n.getMessage(messageName);
  }
}
