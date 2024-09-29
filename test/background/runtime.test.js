import { describe, it } from 'node:test';
import { BACKGROUND_SOURCE } from '../../shared/constants.js';
import { Color } from '../../shared/color.js';
import { Options } from '../../shared/options.js';
import { Part } from '../../shared/browser_parts.js';
import { Runtime } from '../../background/runtime.js';
import { equal } from 'assert';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';

describe('Runtime', () => {
    describe('makeColors', () => {
        it('should return color from theme when part is disabled in options', () => {
            const runtime = new Runtime(null, null);
            const parts = {
                frame: new Part('frame'),
            };

            const OptionsStub = sinon.spy(() => sinon.createStubInstance(Options));
            const options = new OptionsStub();
            options.getGlobalOptions.returns({
                backgroundSource: BACKGROUND_SOURCE.page,
                saturationLimit: '1.0',
                darkness: '0.0',
                brightness: '0.0',
            });
            options.getPartOptions.returns({
                enabled: false,
            });

            const faviconMostPopularColor = new Color('#def');
            const pageMostPopularColor = new Color('#abc');

            const actual_colors = runtime.makeColors(
                parts,
                faviconMostPopularColor,
                pageMostPopularColor
            );
            const expected_colors = {
                frame: '',
            };

            equal(actual_colors, expected_colors);
        });
    });
});
