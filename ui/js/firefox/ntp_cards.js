import { Div } from "../../../lib/elements/elements.js";
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
    this.build(rows, columns);
  }

  /**
   *
   * @param {number} rows
   * @param {number} columns
   * @returns {NtpCards}
   */
  build(rows, columns) {
    for (let i = 0; i < rows; i++) {
      const height = `${100 / rows}%`;
      const cardsRow = new Div({ classList: ["ntp_cards_row"] })
        .setHeight(height)
        .setMaxHeight(height);
      for (let j = 0; j < columns; j++) {
        const cardWrapper = new Div({
          classList: ["ntp_card_wrapper"],
        }).appendChildren([new Div({ classList: ["ntp_card"] }), new Text()]);
        cardsRow.appendChild(cardWrapper);
      }
      this.appendChild(cardsRow);
    }

    const height = `${CARDS_ROW_PERCENTAGE * rows}%`;
    this.setHeight(height).setMaxHeight(height);

    return this;
  }
}
