function url(spec) {
  var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  return ios.newURI(spec, null, null);
}

function raionfire_open() {
  var activeWin = Application.activeWindow;

  var browserTab = activeWin.open(url("chrome://rai-on-fire/content/sidebar.xul"));
  browserTab.focus();
}