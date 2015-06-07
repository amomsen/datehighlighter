// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  console.log("Initializing storage");
  localStorage.notifyFirstDateFound = true;   
  localStorage.notifyOnEmpty = true;        
  localStorage.highligtherColour = "Yellow"; 
}

function fctStart() {
	console.log("fctStart");
	chrome.tabs.getSelected(null, function(tab){ 
		chrome.tabs.executeScript(null, {file: 'jquery-1.10.2.js'});
		chrome.tabs.executeScript(null, {file: 'contentscript.js'});
	}); 
}

chrome.browserAction.onClicked.addListener(fctStart);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("Message");
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage});
    else
      sendResponse({}); // snub them.
});