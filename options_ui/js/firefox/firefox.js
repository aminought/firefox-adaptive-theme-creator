import { GROUPS, GROUP_NAMES, Part } from "../../../shared/browser_parts.js";

import { ContextMenu } from "./context_menu.js";
import { Div } from "../ui_elements/div.js";
import { Group } from "./group.js";
import { ICONS } from "./icons.js";
import { Localizer } from "../utils/localizer.js";
import { NamedPart } from "./named_part.js";
import { NtpCards } from "./npt_cards.js";
import { NtpSearch } from "./ntp_search.js";
import { Options } from "../../../shared/options.js";
import { POSITION } from "../utils/positions.js";
import { Placeholder } from "./placeholder.js";
import { PopupController } from "../popup_controller.js";
import { StatusBar } from "../status_bar.js";
import { Text } from "./text.js";
import { ToolbarButton } from "./toolbar_button.js";

export class Firefox {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
    this.element = new Div({ id: "firefox" });
    this.navigator = new NamedPart("navigator");
    this.titlebar = new Group("titlebar");
    this.tabSelected = new Group("tab_selected");
    this.toolbar = new Group("toolbar");
    this.toolbarField = new Group("toolbar_field");
    this.toolbarBackButton = new ToolbarButton(
      "toolbar_back_button",
      ICONS.BACK
    );
    this.toolbarForwardButton = new ToolbarButton(
      "toolbar_forward_button",
      ICONS.FORWARD
    );
    this.toolbarReloadButton = new ToolbarButton(
      "toolbar_reload_button",
      ICONS.RELOAD
    );
    this.toolbarMenuButton = new ToolbarButton(
      "toolbar_menu_button",
      ICONS.MENU
    );
    this.popup = new Group("popup");
    this.bookmarks = new Group("bookmarks");
    this.browser = new NamedPart("browser");
    this.sidebar = new Group("sidebar");
    this.ntp = new Group("ntp");

    this.groups = {
      [this.titlebar.id]: [this.titlebar, GROUP_NAMES.TITLEBAR],
      [this.tabSelected.id]: [this.tabSelected, GROUP_NAMES.TABS],
      [this.toolbar.id]: [this.toolbar, GROUP_NAMES.TOOLBAR],
      [this.toolbarField.id]: [this.toolbarField, GROUP_NAMES.TOOLBAR_FIELD],
      [this.toolbarBackButton.id]: [
        this.toolbarBackButton,
        GROUP_NAMES.BUTTONS_AND_ICONS,
      ],
      [this.toolbarForwardButton.id]: [
        this.toolbarForwardButton,
        GROUP_NAMES.BUTTONS_AND_ICONS,
      ],
      [this.toolbarReloadButton.id]: [
        this.toolbarReloadButton,
        GROUP_NAMES.BUTTONS_AND_ICONS,
      ],
      [this.toolbarMenuButton.id]: [
        this.toolbarMenuButton,
        GROUP_NAMES.BUTTONS_AND_ICONS,
      ],
      [this.popup.id]: [this.popup, GROUP_NAMES.POPUP],
      [this.bookmarks.id]: [this.bookmarks, GROUP_NAMES.BOOKMARKS],
      [this.sidebar.id]: [this.sidebar, GROUP_NAMES.SIDEBAR],
      [this.ntp.id]: [this.ntp, GROUP_NAMES.NTP],
    };

    for (const groupItemId of Object.keys(this.groups)) {
      const [groupItem, groupName] = this.groups[groupItemId];
      groupItem.setOnMouseEnter(() => {
        PopupController.showFixed(
          new StatusBar(groupName, {
            localize: Localizer.localizePartGroup,
            timeout: null,
          })
        );
      });
      groupItem.setOnMouseLeave((event) => {
        PopupController.removeFixed("status_bar");
        const parentGroupItemId = event.relatedTarget?.id;
        if (parentGroupItemId in this.groups) {
          const [parentGroupName] = this.groups[parentGroupItemId].slice(-1);
          PopupController.showFixed(
            new StatusBar(parentGroupName, {
              localize: Localizer.localizePartGroup,
              timeout: null,
            })
          );
        }
      });
    }

    this.element.setOnContextMenu((event) => {
      event.preventDefault();
      let { target } = event;
      while (!(target.id in this.groups) && target.parentElement) {
        target = target.parentElement;
      }
      const [groupName] = this.groups[target.id].slice(-1);
      const parts = GROUPS[groupName];
      const context_menu = new ContextMenu(parts, this.options, {
        position: POSITION.POINTER,
      });
      if (!PopupController.popFor(target)) {
        PopupController.push(event, context_menu, target, POSITION.POINTER);
      }
    });
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.appendChildren([
      this.navigator.appendChildren([
        this.titlebar.appendChild(this.tabSelected.appendChild(new Text())),
        this.toolbar.appendChildren([
          this.toolbarBackButton,
          this.toolbarForwardButton,
          this.toolbarReloadButton,
          new Placeholder(),
          new Placeholder(),
          this.toolbarField.appendChild(new Text()),
          new Placeholder(),
          new Placeholder(),
          new Placeholder(),
          new Placeholder(),
          this.toolbarMenuButton,
          this.popup.appendChildren([new Text(), new Text()]),
        ]),
        this.bookmarks,
      ]),
      this.browser.appendChildren([
        this.sidebar.appendChildren([new Text(), new Text(), new Text()]),
        this.ntp.appendChildren([new NtpSearch(), new NtpCards(1, 6)]),
      ]),
    ]);

    return this.element.draw();
  }
}
