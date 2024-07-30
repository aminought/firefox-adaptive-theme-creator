export class PopupController {
  static stack = [];

  /**
   *
   * @param {object} popup
   * @param  {...any} args
   */
  static push(popup, ...args) {
    popup.draw(...args);
    this.stack.push(popup);
  }

  static pop() {
    if (!this.stack.length) {
      return;
    }
    const popup = this.stack.pop();
    popup.remove();
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  static popFor(element) {
    let popped = false;
    while (!this.empty()) {
      const popupElement = this.peek().element;
      if (popupElement.contains(element)) {
        return popped;
      }
      this.pop();
      popped = true;
    }
    return popped;
  }

  /**
   *
   * @returns {object}
   */
  static peek() {
    return this.stack[this.stack.length - 1];
  }

  static clear() {
    while (!this.empty()) {
      this.pop();
    }
  }

  static empty() {
    return !this.stack.length;
  }
}
