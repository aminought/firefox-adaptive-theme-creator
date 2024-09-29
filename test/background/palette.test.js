import { describe, it } from 'node:test';
import { Palette } from '../../background/palette.js';
import { equal } from 'assert';

describe('Palette', () => {
    describe('encodeColor', () => {
        it('should return "1,2,3" when input is [1, 2, 3]', () => {
            const color = Palette.encodeColor([1, 2, 3]);
            equal(color, '1,2,3');
        });
    });
});
