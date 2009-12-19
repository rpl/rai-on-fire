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

function render(data) {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow.wrappedJSObject;  
    iframe.postMessage(JSON.stringify(data), "*");  
}

function download() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://www.rai.tv/dl/RaiTV/videoWall/PublishingBlock-5566288c-3d21-48dc-b3e2-af7fbe3b2af8.xml', true);
    req.onreadystatechange = function onreadychange(aEvt) {
	if (req.readyState == 4) {
	    if (req.status == 200) {
		render(parse(req.responseXML));
		//Application.console.log(req.responseText);
	    }
	    else
		Application.console.log("Error loading page\n");
	}
	
    }

    req.send(null);
}

/* LINK LOCATIONS

http://www.rai.tv/dl/RaiTV/videoWall/PublishingBlock-5566288c-3d21-48dc-b3e2-af7fbe3b2af8.xml
http://www.rai.tv/dl/RaiTV/diretta.html?cid=PublishingBlock-eedb4649-b6c4-4892-a5a9-e2ca63b54bd8&channel=Rai%20Tre
http://www.rai.tv/dl/RaiTV/diretta.html?cid=PublishingBlock-64203784-70f7-4b53-9d21-b14693850195&channel=Rai%20Uno

*/
