import { PARTS, Part } from "../../shared/browser_parts.js";
import { describe, it } from "node:test";

import { expect } from "../../node_modules/chai/chai.js";

describe("Part", () => {
  describe("getInheritances", () => {
    it("should return inheritances with parent part when parent_part is set", () => {
      const part = new Part("part", { parentPart: "parent_part" });
      const actualInheritances = part.getInheritances();
      expect(actualInheritances).to.deep.equal([
        "OFF",
        "GLOBAL",
        "parent_part",
      ]);
    });

    it("should return only default inheritances when parent_part is not set", () => {
      const part = new Part("part");
      const actualInheritances = part.getInheritances();
      expect(actualInheritances).to.deep.equal(["OFF", "GLOBAL"]);
    });
  });
});

describe("PARTS", () => {
  it("should have 39 parts", () => {
    expect(Object.keys(PARTS).length).to.equal(39);
  });

  it("should have foreground parts with backgroundPart set", () => {
    for (const part of Object.values(PARTS)) {
      if (part.isForeground) {
        expect(part.backgroundPart).to.not.equal(null);
      }
    }
  });
});
