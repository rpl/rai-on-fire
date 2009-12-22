function parse(xmlblock) {
  window.DEBUG = xmlblock;
  window.RAITV = {
    generationDate: "",
    channels: []
  }

  RAITV.generationDate = xmlblock.getElementsByTagName("block")[0].getAttribute("generationDate");
  
  var sets = xmlblock.getElementsByTagName("set");
  var channels = [];

  for (var i=0; i<sets.length; i++) {
    //Application.console.log(sets[i].getAttribute("name"));
    var videos = sets[i].getElementsByTagName("videoUnit");
    var video_array = [];

    for (var j=0; j<videos.length; j++) {
	video_array.push({
            name: videos[j].getAttribute("name"),
            url: videos[j].getElementsByTagName("url")[0].textContent
	});
    }

    channels.push({
      name: sets[i].getAttribute("name"),
      videos: video_array
    });
  }

    RAITV.channels = channels;
    return RAITV;
}

function showMessage(msg) {
    var videonav_window = document.getElementById("raionfire-videonav-iframe").contentWindow;  
    videonav_window.postMessage(JSON.stringify({ show_message: msg }), "*");
}

function hideMessage() {
    var videonav_window = document.getElementById("raionfire-videonav-iframe").contentWindow;  
    videonav_window.postMessage(JSON.stringify({ hide_message: true }), "*");
}


function render(data) {
    var videonav_window = document.getElementById("raionfire-videonav-iframe").contentWindow;  
    videonav_window.postMessage(JSON.stringify(data), "*");  
}

function transferCompleted(evt) {
    showMessage("Caricamento del palinsesto RAI completato... buona visione!");
    setTimeout(hideMessage, 3000);
}

function transferFailed(evt) {
    showMessage("Impossibile scaricare il palinsesto RAI... controllare la connessione di rete.");
}

function transferAborted(evt) {
    showMessage("Caricamento del palinsesto RAI annullato.");
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    var percentComplete = Math.ceil(evt.loaded / evt.total * 100);
    showMessage("Caricamento in corso... "+percentComplete+"%");
  } else {
    showMessage("Caricamento in corso... impossibile determinarne la durata ");
  }
}



function download() {
    var download_button = document.getElementById("raionfire-download-button");
    var videonav_iframe = document.getElementById("raionfire-videonav-iframe");

    if(download_button.getAttribute("label") !== "Download") {
      download.req.abort();
      download_button.setAttribute("label", "Download");
      return;
    }	  
    //NOTE: clean iframe DOM...
    videonav_iframe.contentDocument.location.reload();
    //NOTE: send http request
    var req = download.req = new XMLHttpRequest();
    req.addEventListener("progress", updateProgress, false);
    req.addEventListener("load", transferCompleted, false);
    req.addEventListener("error", transferFailed, false);
    req.addEventListener("abort", transferAborted, false);
    req.open('GET', 'http://www.rai.tv/dl/RaiTV/videoWall/PublishingBlock-5566288c-3d21-48dc-b3e2-af7fbe3b2af8.xml', true);
    req.onreadystatechange = function onreadychange(aEvt) {
        download_button.setAttribute("label", "caricamento... annullare?");
	if (req.readyState == 4) {
            download_button.setAttribute("label", "Download");
	    if (req.status == 200) {
		render(parse(req.responseXML));
		//Application.console.log(req.responseText);
	    }
	    else {
	        render_error_loading();
		Application.console.log("ERROR - raionfire: Error loading page\n");
            }			       
	}
	
    }

    req.send(null);
}

/* LINK LOCATIONS

http://www.rai.tv/dl/RaiTV/videoWall/PublishingBlock-5566288c-3d21-48dc-b3e2-af7fbe3b2af8.xml
http://www.rai.tv/dl/RaiTV/diretta.html?cid=PublishingBlock-eedb4649-b6c4-4892-a5a9-e2ca63b54bd8&channel=Rai%20Tre
http://www.rai.tv/dl/RaiTV/diretta.html?cid=PublishingBlock-64203784-70f7-4b53-9d21-b14693850195&channel=Rai%20Uno

*/
