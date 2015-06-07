

/*
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black';
                                              // The label color.
  options.frequency.disabled = isDeactivated; // The control manipulability.
}*/

window.addEventListener('load', function() {
	console.log("load");
	console.log(JSON.parse(localStorage.notifyFirstDateFound));
	console.log(JSON.parse(localStorage.notifyOnEmpty));
	console.log(localStorage.highligtherColour);
	// Initialize the option controls.
	options.notifyFirstDateFound.checked = JSON.parse(localStorage.notifyFirstDateFound);
                                         
										 
	options.notifyOnEmpty.checked = JSON.parse(localStorage.notifyOnEmpty);
	options.highligtherColour.value = localStorage.highligtherColour;
  //options.frequency.value = localStorage.frequency;
                                         

 // if (!options.isActivated.checked) { ghost(true); }

  // Set the display activation and frequency.
  options.notifyFirstDateFound.onchange = function() {
	console.log("notifyFirstDateFound " + options.notifyFirstDateFound.checked);
	localStorage.notifyFirstDateFound = options.notifyFirstDateFound.checked;
	
    //localStorage.isActivated = options.isActivated.checked;
    //ghost(!options.isActivated.checked);
  };

  options.notifyOnEmpty.onchange = function() {
	console.log("notifyOnEmpty " + options.notifyOnEmpty.checked);
    localStorage.notifyOnEmpty = options.notifyOnEmpty.checked;
  };
  
  options.highligtherColour.onchange = function() {
	console.log("highligtherColour " + options.highligtherColour.value);
    localStorage.highligtherColour = options.highligtherColour.value;
  };
  
});
