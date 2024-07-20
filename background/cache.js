const MAX_LENGTH = 100;

// eslint-disable-next-line no-unused-vars
class Cache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size === MAX_LENGTH) {
      this.cache.delete(this.first());
    }
    this.cache.set(key, value);
  }

  first() {
    return this.cache.keys().next().value;
  }
}
