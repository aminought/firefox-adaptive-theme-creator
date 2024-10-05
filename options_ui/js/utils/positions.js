export const POSITION = {
  ABOVE: "ABOVE",
  BELOW_ALIGN_CENTER: "BELOW_ALIGN_CENTER",
  BELOW_ALIGN_LEFT: "BELOW_ALIGN_LEFT",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  INPLACE: "INPLACE",
  POINTER: "POINTER",
};

/**
 *
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {number} clientX
 * @param {number} clientY
 */
export const positionByCoords = (child, parent, clientX, clientY) => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  let x = clientX - parentRect.left;
  let y = clientY - parentRect.top;

  if (x + childRect.width > parentRect.right) {
    x = parentRect.right - childRect.width;
  }
  if (x < parentRect.left) {
    x = parentRect.left;
  }
  if (y + childRect.height > parentRect.bottom) {
    y = parentRect.bottom - childRect.height;
  }
  if (y < parentRect.top) {
    y = parentRect.top;
  }

  child.style.left = `${x}px`;
  child.style.top = `${y}px`;
};

/**
 *
 * @param {string} pos
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {HTMLElement} target
 * @param {number=} padding
 */
export const positionRelative = (pos, child, parent, target, padding = 4) => {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  let x = -parentRect.left;
  let y = -parentRect.top;

  if (pos === POSITION.ABOVE) {
    x += targetRect.left + targetRect.width / 2 - childRect.width / 2;
    y += targetRect.top - childRect.height - padding;
  } else if (
    pos === POSITION.BELOW_ALIGN_CENTER ||
    pos === POSITION.BELOW_ALIGN_LEFT
  ) {
    y += targetRect.bottom + padding;
    if (pos === POSITION.BELOW_ALIGN_CENTER) {
      x += targetRect.left + targetRect.width / 2 - childRect.width / 2;
    } else if (pos === POSITION.BELOW_ALIGN_LEFT) {
      x += targetRect.left;
    }
  } else if (pos === POSITION.LEFT) {
    x += targetRect.left - childRect.width - padding;
    y += targetRect.top;
  } else if (pos === POSITION.RIGHT) {
    x += targetRect.right + padding;
    y += targetRect.top;
  } else if (pos === POSITION.INPLACE) {
    x += targetRect.left;
    y += targetRect.top;
  }

  if (x + childRect.width > parentRect.right) {
    x = parentRect.right - childRect.width;
  }
  if (x < parentRect.left) {
    x = parentRect.left;
  }
  if (y + childRect.height > parentRect.bottom) {
    y = parentRect.bottom - childRect.height;
  }
  if (y < parentRect.top) {
    y = parentRect.top;
  }

  child.style.left = `${x}px`;
  child.style.top = `${y}px`;
};
