import { Div } from "../ui_elements/div.js";
import { Group } from "./group.js";
import { ICONS } from "./icons.js";
import { NamedPart } from "./named_part.js";
import { Placeholder } from "./placeholder.js";
import { Text } from "./text.js";
import { ToolbarButton } from "./toolbar_button.js";

export class Firefox {
  constructor() {
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

    this.toolbarButtons = [
      this.toolbarBackButton,
      this.toolbarForwardButton,
      this.toolbarReloadButton,
      this.toolbarMenuButton,
    ];
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
        this.ntp,
      ]),
    ]);

    return this.element.draw();
  }
}
