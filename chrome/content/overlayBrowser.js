function url(spec) {
  var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  return ios.newURI(spec, null, null);
}

function onTabOpen(event) {
  // Note that alert does not work, as the event gets called before the tab is loaded.
  var theTab = event.data.tab;    // Get the FUEL BrowserTab object for the tab
  Application.console.log("It opened");
}


function raionfire_open() {
  var activeWin = Application.activeWindow;
  activeWin.events.addListener("TabOpen", onTabOpen);

  var browserTab = activeWin.open(url("chrome://rai-on-fire/content/sidebar.xul"));
  browserTab.focus();
}