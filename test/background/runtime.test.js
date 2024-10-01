/* eslint-disable max-lines */
import { BACKGROUND_SOURCE, FOREGROUND_SOURCE, INHERITANCE } from '../../shared/constants.js';
import { PARTS, Part } from '../../shared/browser_parts.js';
import { describe, it } from 'node:test';
import { Color } from '../../shared/color.js';
import { DEFAULT_OPTIONS } from '../../shared/default_options.js';
import { Options } from '../../shared/options.js';
import { Runtime } from '../../background/runtime.js';
import { Theme } from '../../shared/theme.js';
import { expect } from '../../node_modules/chai/chai.js';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';

const mockOptions = () => {
    const OptionsStub = sinon.spy(() => sinon.createStubInstance(Options));
    return new OptionsStub();
};

const mockOptionsGetGlobalOptions = (
    options,
    {
        backgroundSource = BACKGROUND_SOURCE.COLOR,
        backgroundColor = 'rgb(1 1 1)',
        foregroundSource = FOREGROUND_SOURCE.COLOR,
        foregroundColor = 'rgb(2 2 2)',
    } = {}
) => {
    options.getGlobalOptions.returns({
        background: {
            source: backgroundSource,
            color: backgroundColor,
            saturationLimit: '1.0',
            darkness: '0.0',
            brightness: '0.0',
        },
        foreground: {
            source: foregroundSource,
            color: foregroundColor,
            saturationLimit: '1.0',
            darkness: '0.0',
            brightness: '0.0',
        },
    });
};

const mockOptionsGetPartOptions = (
    options,
    part,
    {
        enabled = false,
        inheritance = INHERITANCE.OFF,
        source = BACKGROUND_SOURCE.PAGE,
        color = 'rgb(0 0 0)',
    } = {}
) => {
    options.getPartOptions.withArgs(part).returns({
        enabled,
        inheritance,
        source,
        color,
        saturationLimit: '1.0',
        darkness: '0.0',
        brightness: '0.0',
    });
};

const mockTheme = () => {
    const ThemeStub = sinon.spy(() => sinon.createStubInstance(Theme));
    return new ThemeStub();
};

const mockThemeGetColor = (theme, part, color) => {
    theme.getColor.withArgs(part).returns(new Color(color));
};

const THEME_COLOR = 'rgb(100 100 100)';
const GLOBAL_BACKGROUND_COLOR = 'rgb(101 101 101)';
const GLOBAL_FOREGROUND_COLOR = 'rgb(102 102 102)';
const FAVICON_MOST_POPULAR_COLOR = 'rgb(103 103 103)';
const PAGE_MOST_POPULAR_COLOR = 'rgb(104 104 104)';

describe('Runtime', () => {
    describe('makeColors', () => {
        const makePartParams = (
            name,
            expectedColor,
            {
                enabled = false,
                isForeground = false,
                inheritance = INHERITANCE.OFF,
                backgroundPart = null,
                source = BACKGROUND_SOURCE.COLOR,
                color = 'rgb(0 0 0)',
                themeColor = THEME_COLOR,
            } = {}
        ) => ({
            name,
            expectedColor,
            enabled,
            isForeground,
            inheritance,
            backgroundPart,
            source,
            color,
            themeColor,
        });
        const makeParams = (
            id,
            parts,
            {
                globalBackgroundColor = GLOBAL_BACKGROUND_COLOR,
                globalForegroundColor = GLOBAL_FOREGROUND_COLOR,
                faviconMostPopularColor = FAVICON_MOST_POPULAR_COLOR,
                pageMostPopularColor = PAGE_MOST_POPULAR_COLOR,
                globalBackgroundSource = BACKGROUND_SOURCE.COLOR,
            } = {}
        ) => ({
            id,
            parts,
            globalBackgroundColor,
            globalForegroundColor,
            faviconMostPopularColor,
            pageMostPopularColor,
            globalBackgroundSource,
        });
        const tests = [
            makeParams('should return theme color when disabled', [
                makePartParams('frame', THEME_COLOR),
            ]),
            makeParams('should return global color when enabled and inheritance is global', [
                makePartParams('frame', GLOBAL_BACKGROUND_COLOR, {
                    enabled: true,
                    inheritance: INHERITANCE.GLOBAL,
                }),
            ]),
            makeParams(
                'should return favicon color when enabled, inheritance is off and source is favicon',
                [
                    makePartParams('frame', FAVICON_MOST_POPULAR_COLOR, {
                        enabled: true,
                        inheritance: INHERITANCE.OFF,
                        source: BACKGROUND_SOURCE.FAVICON,
                    }),
                ]
            ),
            makeParams(
                'should return favicon color when enabled, inheritance is global and global source is favicon',
                [
                    makePartParams('frame', FAVICON_MOST_POPULAR_COLOR, {
                        enabled: true,
                        inheritance: INHERITANCE.GLOBAL,
                    }),
                ],
                {
                    globalBackgroundSource: BACKGROUND_SOURCE.FAVICON,
                }
            ),
            makeParams(
                'should return page color when enabled, inheritance is off and source is page',
                [
                    makePartParams('frame', PAGE_MOST_POPULAR_COLOR, {
                        enabled: true,
                        inheritance: INHERITANCE.OFF,
                        source: BACKGROUND_SOURCE.PAGE,
                    }),
                ]
            ),
            makeParams(
                'should return page color when enabled, inheritance is global and global source is page',
                [
                    makePartParams('frame', PAGE_MOST_POPULAR_COLOR, {
                        enabled: true,
                        inheritance: INHERITANCE.GLOBAL,
                    }),
                ],
                {
                    globalBackgroundSource: BACKGROUND_SOURCE.PAGE,
                }
            ),
            makeParams(
                'should return own color when enabled, inheritance is off and source is own color',
                [
                    makePartParams('frame', 'rgb(0 0 0)', {
                        enabled: true,
                        inheritance: INHERITANCE.OFF,
                        source: BACKGROUND_SOURCE.COLOR,
                    }),
                ]
            ),
            makeParams(
                'should return own colors for two parts when enabled, inheritance is off and source is own color',
                [
                    makePartParams('frame', 'rgb(0 0 0)', {
                        enabled: true,
                        color: 'rgb(0 0 0)',
                    }),
                    makePartParams('popup', 'rgb(1 1 1)', {
                        enabled: true,
                        color: 'rgb(1 1 1)',
                    }),
                ]
            ),
            makeParams('should return one color for all inherited parts', [
                makePartParams('frame', 'rgb(0 0 0)', {
                    enabled: true,
                    color: 'rgb(0 0 0)',
                }),
                makePartParams('popup', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'frame',
                    color: 'rgb(1 1 1)',
                }),
                makePartParams('sidebar', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'popup',
                    color: 'rgb(2 2 2)',
                }),
                makePartParams('tab_selected', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'sidebar',
                    color: 'rgb(3 3 3)',
                }),
            ]),
            makeParams('should return one color for all inherited parts when order is reverted', [
                makePartParams('tab_selected', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'sidebar',
                    color: 'rgb(3 3 3)',
                }),
                makePartParams('sidebar', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'popup',
                    color: 'rgb(2 2 2)',
                }),
                makePartParams('popup', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'frame',
                    color: 'rgb(1 1 1)',
                }),
                makePartParams('frame', 'rgb(0 0 0)', {
                    enabled: true,
                    color: 'rgb(0 0 0)',
                }),
            ]),
            makeParams('should return two colors for two groups of inherited parts', [
                makePartParams('frame', 'rgb(0 0 0)', {
                    enabled: true,
                    color: 'rgb(0 0 0)',
                }),
                makePartParams('popup', 'rgb(0 0 0)', {
                    enabled: true,
                    inheritance: 'frame',
                    color: 'rgb(1 1 1)',
                }),
                makePartParams('sidebar', 'rgb(2 2 2)', {
                    enabled: true,
                    color: 'rgb(2 2 2)',
                }),
                makePartParams('tab_selected', 'rgb(2 2 2)', {
                    enabled: true,
                    inheritance: 'sidebar',
                    color: 'rgb(3 3 3)',
                }),
            ]),
            makeParams(
                'should return white color for foreground part when source is auto and background is black',
                [
                    makePartParams('background', 'rgb(0 0 0)', {
                        enabled: true,
                        color: 'rgb(0 0 0)',
                    }),
                    makePartParams('foreground', 'rgb(255 255 255)', {
                        enabled: true,
                        isForeground: true,
                        backgroundPart: 'background',
                        source: FOREGROUND_SOURCE.AUTO,
                        color: 'rgb(1 1 1)',
                    }),
                ]
            ),
            makeParams(
                'should return black color for foreground part when source is auto background is white',
                [
                    makePartParams('background', 'rgb(255 255 255)', {
                        enabled: true,
                        color: 'rgb(255 255 255)',
                    }),
                    makePartParams('foreground', 'rgb(0 0 0)', {
                        enabled: true,
                        isForeground: true,
                        backgroundPart: 'background',
                        source: FOREGROUND_SOURCE.AUTO,
                        color: 'rgb(1 1 1)',
                    }),
                ]
            ),
            makeParams(
                'should return theme color if favicon most popular color is null',
                [
                    makePartParams('tab_selected', 'rgb(200 200 200)', {
                        enabled: true,
                        source: BACKGROUND_SOURCE.FAVICON,
                        color: 'rgb(0 0 0)',
                        themeColor: 'rgb(200 200 200)',
                    }),
                    makePartParams('tab_text', 'rgb(0 0 0)', {
                        enabled: true,
                        isForeground: true,
                        backgroundPart: 'tab_selected',
                        source: FOREGROUND_SOURCE.AUTO,
                        color: 'rgb(1 1 1)',
                        themeColor: 'rgb(201 201 201)',
                    }),
                ],
                { faviconMostPopularColor: null }
            ),
        ];
        tests.forEach((test) => {
            it(test.id, () => {
                const options = mockOptions();
                const theme = mockTheme();

                mockOptionsGetGlobalOptions(options, {
                    backgroundSource: test.globalBackgroundSource,
                    backgroundColor: test.globalBackgroundColor,
                    foregroundSource: test.globalForegroundSource,
                    foregroundColor: test.globalForegroundColor,
                });

                const parts = {};
                for (const partParams of test.parts) {
                    const partName = partParams.name;
                    parts[partName] = new Part(partName, {
                        isForeground: partParams.isForeground,
                        backgroundPart: partParams.backgroundPart,
                    });

                    mockOptionsGetPartOptions(options, partName, {
                        enabled: partParams.enabled,
                        inheritance: partParams.inheritance,
                        source: partParams.source,
                        color: partParams.color,
                    });
                    mockThemeGetColor(theme, partName, partParams.themeColor);
                }

                const runtime = new Runtime(options, theme);

                const actualColors = runtime.makeColors(
                    parts,
                    test.faviconMostPopularColor ? new Color(test.faviconMostPopularColor) : null,
                    test.pageMostPopularColor ? new Color(test.pageMostPopularColor) : null
                );

                expect(Object.keys(actualColors).sort()).to.deep.equal(Object.keys(parts).sort());
                for (const partParams of test.parts) {
                    expect(actualColors[partParams.name].css()).to.equal(partParams.expectedColor);
                }
            });
        });

        it('should return colors for PARTS', () => {
            const options = mockOptions();
            const theme = mockTheme();

            mockOptionsGetGlobalOptions(options, {
                backgroundSource: BACKGROUND_SOURCE.COLOR,
                backgroundColor: 'rgb(0 0 0)',
                foregroundSource: BACKGROUND_SOURCE.COLOR,
                foregroundColor: 'rgb(1 1 1)',
            });

            for (const part of Object.values(PARTS)) {
                const partOptions = DEFAULT_OPTIONS.parts[part.name];
                mockOptionsGetPartOptions(options, part.name, {
                    enabled: partOptions.enabled,
                    inheritance: partOptions.inheritance,
                    source: partOptions.source,
                    color: partOptions.color,
                });
                mockThemeGetColor(
                    theme,
                    part.name,
                    part.isForeground ? 'rgb(2 2 2)' : 'rgb(3 3 3)'
                );
            }

            const runtime = new Runtime(options, theme);

            const actualColors = runtime.makeColors(
                PARTS,
                new Color('rgb(4 4 4)'),
                new Color('rgb(5 5 5)')
            );

            for (const [partName, color] of Object.entries(actualColors)) {
                const part = PARTS[partName];
                const partOptions = DEFAULT_OPTIONS.parts[part.name];
                const colorCss = color.css();
                if (!partOptions.enabled) {
                    // Theme color
                    expect(colorCss).to.equal(
                        part.isForeground ? 'rgb(2 2 2)' : 'rgb(3 3 3)',
                        part.name
                    );
                } else if (partOptions.inheritance === INHERITANCE.GLOBAL) {
                    // Global background color
                    expect(colorCss).to.equal(
                        part.isForeground ? 'rgb(1 1 1)' : 'rgb(0 0 0)',
                        part.name
                    );
                } else if (partOptions.inheritance === INHERITANCE.OFF) {
                    if (partOptions.source === BACKGROUND_SOURCE.PAGE) {
                        // Page color
                        expect(colorCss).to.equal('rgb(5 5 5)', part.name);
                    } else if (partOptions.source === BACKGROUND_SOURCE.FAVICON) {
                        // Favicon color
                        expect(colorCss).to.equal('rgb(4 4 4)', part.name);
                    } else if (partOptions.source === BACKGROUND_SOURCE.COLOR) {
                        // Custom color
                        expect(colorCss).to.equal(partOptions.color, part.name);
                    } else if (partOptions.source === FOREGROUND_SOURCE.AUTO) {
                        // Auto color for foreground parts
                        expect(colorCss).to.equal('rgb(255 255 255)', part.name);
                    } else {
                        expect(true).to.equal(false, part.name);
                    }
                } else {
                    // Global background color for background parts
                    expect(colorCss).to.equal('rgb(0 0 0)', part.name);
                }
            }
        });
    });
});
