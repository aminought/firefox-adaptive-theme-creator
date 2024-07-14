// eslint-disable-next-line no-unused-vars
const notifyNotCompatible = () => {
  browser.notifications.create({
    iconUrl: browser.runtime.getURL("icons/icon.svg"),
    message: "Change theme in the preferences",
    title: "Favicon Color is not compatible with System Theme",
    type: "basic",
  });
}
