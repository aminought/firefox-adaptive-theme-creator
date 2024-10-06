import { describe, it } from "node:test";

import { Options } from "../../shared/options.js";
import { PARTS } from "../../shared/browser_parts.js";
import { expect } from "../../node_modules/chai/chai.js";

class Storage {
  constructor(options) {
    this.options = options;
  }

  get() {
    return this.options;
  }

  set(options) {
    this.options = options;
  }
}

describe("Options", () => {
  describe("load", () => {
    it("should load options from storage", async () => {
      const storage = new Storage({
        global: "global",
        parts: "parts",
        unknown: "unknown",
      });
      const options = new Options(storage);
      await options.load();

      expect(options.options).to.deep.equal({
        global: "global",
        parts: "parts",
      });
    });
  });

  describe("save", () => {
    it("should save options to storage", async () => {
      const storage = new Storage({
        global: "global",
        parts: "parts",
        unknown: "unknown",
      });
      const options = new Options(storage);
      await options.save();

      expect(storage.options).to.have.property("global");
      expect(storage.options).to.have.property("parts");
      expect(storage.options).to.not.have.property("unknown");

      expect(Object.keys(options.options.parts).length).to.equal(
        Object.keys(PARTS).length
      );
      expect(Object.keys(storage.options.parts).length).to.equal(
        Object.keys(PARTS).length
      );
    });
  });

  describe("reset", () => {
    it("should reset options", async () => {
      const storage = new Storage({
        global: "global",
        parts: "parts",
        unknown: "unknown",
      });
      const options = new Options(storage);
      await options.load();
      options.reset();

      expect(options.options).to.have.property("global");
      expect(options.options).to.have.property("parts");
      expect(options.options).to.not.have.property("unknown");

      expect(Object.keys(options.options.parts).length).to.equal(
        Object.keys(PARTS).length
      );
    });
  });

  describe("get", () => {
    it("should return option when path is correct", async () => {
      const storage = new Storage({
        global: {
          enabled: false,
          background: {
            source: "color",
            color: "red",
          },
        },
        parts: {
          frame: {
            darkness: "0.5",
          },
        },
      });
      const options = new Options(storage);
      await options.load();

      expect(options.get("global.enabled")).to.equal(false);
      expect(options.get("global.background.source")).to.equal("color");
      expect(options.get("global.background.color")).to.equal("red");
      expect(options.get("parts.frame.darkness")).to.equal("0.5");
      expect(options.get("parts.frame.brightness")).to.equal(null);
    });
  });

  describe("get", () => {
    it("should return option when path is correct and throw otherwise", async () => {
      const storage = new Storage({
        global: {
          enabled: false,
          background: {
            source: "color",
            color: "red",
          },
        },
        parts: {
          frame: {
            darkness: "0.5",
          },
        },
      });
      const options = new Options(storage);
      await options.load();

      options.set("global.enabled", true);
      options.set("global.background.source", "page");
      options.set("global.background.color", "black");
      options.set("parts.frame.darkness", "1.0");

      expect(options.options.global.enabled).to.equal(true);
      expect(options.options.global.background.source).to.equal("page");
      expect(options.options.global.background.color).to.equal("black");
      expect(options.options.parts.frame.darkness).to.equal("1.0");
      expect(() => options.set("parts.sidebar.brightness")).to.throw();
      expect(() => options.set("parts.frame.brightness")).to.throw();
    });
  });

  describe("isSourceNeeded", () => {
    const tests = [
      {
        id: "should return false when no source",
        globalBackgroundSource: "COLOR",
        globalForegroundSource: "COLOR",
        partSource: "COLOR",
        source: "PAGE",
        expected: false,
      },
      {
        id: "should return true when source in globalBackgroundSource",
        globalBackgroundSource: "PAGE",
        globalForegroundSource: "COLOR",
        partSource: "COLOR",
        source: "PAGE",
        expected: true,
      },
      {
        id: "should return true when source in globalForegroundSource",
        globalBackgroundSource: "COLOR",
        globalForegroundSource: "PAGE",
        partSource: "COLOR",
        source: "PAGE",
        expected: true,
      },
      {
        id: "should return false when source in partSource but part is disabled",
        globalBackgroundSource: "COLOR",
        globalForegroundSource: "COLOR",
        partSource: "PAGE",
        partEnabled: false,
        partInheritance: "OFF",
        source: "PAGE",
        expected: false,
      },
      {
        id: "should return false when source in partSource, part is enabled but inheritance is not off",
        globalBackgroundSource: "COLOR",
        globalForegroundSource: "COLOR",
        partSource: "PAGE",
        partEnabled: true,
        partInheritance: "GLOBAL",
        source: "PAGE",
        expected: false,
      },
      {
        id: "should return true when source in partSource, part is enabled and inheritance is off",
        globalBackgroundSource: "COLOR",
        globalForegroundSource: "COLOR",
        partSource: "PAGE",
        partEnabled: true,
        partInheritance: "OFF",
        source: "PAGE",
        expected: true,
      },
    ];
    tests.forEach((test) => {
      it(test.id, async () => {
        const storage = new Storage({
          global: {
            background: {
              source: test.globalBackgroundSource,
            },
            foreground: {
              source: test.globalForegroundSource,
            },
          },
          parts: {
            part: {
              enabled: test.partEnabled,
              inheritance: test.partInheritance,
              source: test.partSource,
            },
          },
        });
        const options = new Options(storage);
        await options.load();

        const isSourceNeeded = options.isSourceNeeded(test.source);
        expect(isSourceNeeded).to.equal(test.expected);
      });
    });
  });
});
