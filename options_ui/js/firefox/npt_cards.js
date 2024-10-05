import { Div } from "../ui_elements/div.js";
import { Text } from "./text.js";

const CARDS_ROW_PERCENTAGE = 15;

export class NtpCards extends Div {
  /**
   *
   * @param {number} rows
   * @param {number} columns
   */
  constructor(rows = 2, columns = 8) {
    super({ id: "ntp_cards" });
    this.rows = rows;
    this.columns = columns;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    for (let i = 0; i < this.rows; i++) {
      const height = `${100 / this.rows}%`;
      const cardsRow = new Div({ classList: ["ntp_cards_row"] })
        .setHeight(height)
        .setMaxHeight(height);
      for (let j = 0; j < this.columns; j++) {
        const cardWrapper = new Div({
          classList: ["ntp_card_wrapper"],
        }).appendChildren([new Div({ classList: ["ntp_card"] }), new Text()]);
        cardsRow.appendChild(cardWrapper);
      }
      this.appendChild(cardsRow);
    }

    const height = `${CARDS_ROW_PERCENTAGE * this.rows}%`;
    this.setHeight(height).setMaxHeight(height);

    for (const child of this.children) {
      this.element.appendChild(child.draw());
    }
    return this.element;
  }
}
