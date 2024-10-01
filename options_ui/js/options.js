import { createNumberDropdown, createStringDropdown } from './dropdown/dropdown_utils.js';

import { BACKGROUND_SOURCE } from '../../shared/constants.js';
import { Div } from './div.js';
import { Label } from './label.js';
import { Localizer } from './utils/localizer.js';

export const makeOptionsUI = (options) => {
    const optionsUI = new Div({ id: 'options' }).appendChild(
        new Div({ classList: ['options_row'] })
            .appendChild(
                new Div({ classList: ['option'] })
                    .appendChild(
                        new Label(Localizer.getMessage('source'), { classList: ['option_title'] })
                    )
                    .appendChild(new Div({ classList: ['separator'] }))
                    .appendChild(
                        createStringDropdown(Object.values(BACKGROUND_SOURCE)).setValue(
                            options.getGlobalOptions().background.source
                        )
                    )
            )
            .appendChild(
                new Div({ classList: ['option'] })
                    .appendChild(
                        new Label(Localizer.getMessage('saturationLimit'), {
                            classList: ['option_title'],
                        })
                    )
                    .appendChild(new Div({ classList: ['separator'] }))
                    .appendChild(
                        createNumberDropdown(0, 1, 0.1).setValue(
                            options.getGlobalOptions().background.saturationLimit
                        )
                    )
            )
    );

    const body = document.querySelector('body');
    body.appendChild(optionsUI.draw());
};
