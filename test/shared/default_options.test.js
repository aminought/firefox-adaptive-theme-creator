import { describe, it } from "node:test";

import { DEFAULT_OPTIONS } from "../../shared/default_options.js";
import { PARTS } from "../../shared/browser_parts.js";
import { expect } from "../../node_modules/chai/chai.js";

describe("DEFAULT_OPTIONS", () => {
  describe("parts", () => {
    it("should have the same parts as PARTS", () => {
      expect(Object.keys(DEFAULT_OPTIONS.parts)).to.deep.equal(
        Object.keys(PARTS)
      );
    });
  });
});
