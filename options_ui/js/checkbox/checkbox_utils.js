import { Checkbox } from "./checkbox.js";

/**
 * 
 * @param {string} id 
 */
export const createCheckbox = (id) => {
    const checkbox = new Checkbox();
    checkbox.id = id;
    return checkbox;
}