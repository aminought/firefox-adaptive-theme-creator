import { Options } from "../../shared/options.js";
import { makeOptionsUI } from "./options_ui.js";
import { PopupController } from "./popup_controller.js";

// import { GROUPS, PARTS } from '../../shared/browser_parts.js';

// import { BrowserPreview } from './browser_preview.js';
// import { ContextMenu } from './context_menu.js';
// import { Form } from './form.js';
// import { Localizer } from './utils/localizer.js';


// import { Theme } from '../../shared/theme.js';

// import { setRootColor } from './utils/html.js';

/**
 *
 * @param {Options} options
 */
// const stylePage = async (options) => {
//     const theme = await Theme.load();
//     const warning = document.getElementById('warning');
//     if (!theme.isCompatible()) {
//         warning.classList.toggle('hidden', false);
//         return;
//     }
//     warning.classList.toggle('hidden', true);

//     setRootColor('--background-color', theme.getColor('popup')?.css());
//     setRootColor('--color', theme.getColor('popup_text')?.css());

//     const C = {
//         [GROUPS.frame]: PARTS.frame,
//         [GROUPS.tabs]: PARTS.tab_selected,
//         [GROUPS.toolbar]: PARTS.toolbar,
//         [GROUPS.toolbar_field]: PARTS.toolbar_field,
//         [GROUPS.popup]: PARTS.popup,
//         [GROUPS.sidebar]: PARTS.sidebar,
//     };

    // for (const group in Object.keys(GROUPS)) {
    //     if (!C[group]) {
    //         continue;
    //     }
    //     const part = C[group];
    //     const partOptions = options.getPartOptions(part.name);
    //     const color = theme.getColor(part);
    //     BrowserPreview.colorPart(part.name, color, partOptions.enabled);
    // }
// };

/**
 *
 * @param {Event} event
 * @param {Options} options
 * @param {BrowserPreview} browserPreview
 */
// const onBrowserPreviewClick = (event, options, browserPreview) => {
//     event.preventDefault();

//     if (!PopupController.empty()) {
//         return;
//     }

//     const { classList } = event.target;
//     let part = event.target.id;

//     if (classList.contains('placeholder')) {
//         part = 'toolbar';
//     }

    // if (BrowserParts.getBackgroundParts().includes(part)) {
    //   const { enabled } = options.getPartOptions(part);
    //   options.setPartOption(part, "enabled", !enabled);
    //   const connectedParts = BrowserParts.getConnectedBackgroundParts(part);
    //   for (const connectedPart of connectedParts) {
    //     options.setPartOption(connectedPart, "enabled", !enabled);
    //   }
    // } else if (part === "appcontent" || part === "rickroll") {
    //   browserPreview.rickroll();
    // }
// };

/**
 *
 * @param {MouseEvent} event
 * @param {Options} options
 */
// const onBrowserPreviewContextMenu = (event, options, body) => {
//     event.preventDefault();
//     PopupController.popFor(event.target);

//     const { classList } = event.target;
//     let part = event.target.id;
//     if (classList.contains('placeholder')) {
//         part = 'toolbar';
//     }
    // if (!BrowserParts.getBackgroundParts().includes(part)) {
    //   return;
    // }

    // const parts = [part];
    // for (const connectedPart of BrowserParts.getConnectedBackgroundParts(part)) {
    //   parts.push(connectedPart);
    // }

    // const contextMenu = new ContextMenu(options, body, parts);
    // PopupController.push(contextMenu, event.clientX, event.clientY);
// };

/**
 *
 * @param {MouseEvent} event
 */
const onBodyClick = (event) => {
    PopupController.popFor(event.target);
};

document.addEventListener('DOMContentLoaded', async () => {
    const body = document.querySelector('body');
    const options = new Options(browser.storage.local);
    await options.load();

    makeOptionsUI(options);
    // eslint-disable-next-line no-unused-vars
    // const form = new Form(options);
    // const browserPreview = new BrowserPreview();

    // Localizer.localizePage();
    // stylePage(options);

    body.onclick = onBodyClick;

    // browserPreview.onClick((e) => onBrowserPreviewClick(e, options, browserPreview));
    // browserPreview.onContextMenu((e) => onBrowserPreviewContextMenu(e, options, body));

    // browser.runtime.onMessage.addListener((message) => {
    //     if (message.event === 'themeUpdated') {
    //         stylePage(options);
    //     }
    // });
});
