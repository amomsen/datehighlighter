//TODO: test
//http://googlecode.blogspot.com/2009/05/rob-campbell-debugging-and-testing-web.html
// consider a special case for copyright and (c)

// ---------------------------------------------------------------------- Regular Expression Declarations ----------------------------------------------------------------------

//TODO: Released: 4/16/2011

//Nov 26 '12 at 16:42
var stackoverflowregex =  /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d?\d ('\d\d)? ?at \d?\d:\d\d/;
//9 Jul 2013
var codeprojectregex =  /\d?\d (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (19|20)\d\d/;
//Sep 25, 2012 or Jan 6th 2014 (6 weeks long)
var coursera = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d?\d,?\w?\w? (19|20)\d\d/;
//2012
var yearregex = / (19|20)\d\d /;
//15 Nov 2013
var essDateRegex = /\d?\d (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d?\d?\d\d)/;
//13-Aug-13 
var date1Regex = /\d?\d-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d)/;
//Aug 13 
var date1Regex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d?\d/;
//Wed, Aug 7, 2013
var gmailregex = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)?,? (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).? \d\d?, (19|20)\d\d/;
//January 25, 2010
var fullMonthregex = /(January|February|March|April|May|June|July|August|September|October|November|December),? \d\d?,? (19|20)\d\d/;
//08 August 2013
var longDateAndTime = /(January|February|March|April|May|June|July|August|September|October|November|December) \d\d,? (19|20)\d\d/;
//September 10, 2013
var dateAndTime = /\d\d? (January|February|March|April|May|June|July|August|September|October|November|December) ?(19|20)?\d?\d?/;
//Wed 19:12
var dayAndTime = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d\d:\d\d/;
//2013-07-30
var hyphenDate = /(19|20)\d\d-\d\d-\d\d/;
//20130801
var compactDate = /(19|20)\d\d\d\d\d\d/;
//12/12/2011 
var ddmmyyyy = /\d\d\/(0?1|0?2|0?3|0?4|0?5|0?6|0?7|0?9|10|11|12)\/(19|20)\d\d/;
//12/12/11
var ddmmyy = /\d\d\/(0?1|0?2|0?3|0?4|0?5|0?6|0?7|0?9|10|11|12)\/\d\d/;

// ---------------------------------------------------------------------- Local variables ----------------------------------------------------------------------
var found = false;
var firstDateFound = '';
var firstDateFoundPosition = -1;

//  ---- Options ----
var highligtherColour = 'Yellow';
var notifyFirstDateFound = true;
var notifyOnEmpty = true;

// ---------------------------------------------------------------------- Send message to get localstorage data ---------------------------------------------------
chrome.extension.sendMessage({method: "getLocalStorage"}, function(response) {

	console.log("chrome.extension.sendMessage highligtherColour " + highligtherColour);
	console.log("chrome.extension.sendMessage notifyFirstDateFound " + notifyFirstDateFound);
	console.log("chrome.extension.sendMessage notifyOnEmpty " + notifyOnEmpty);
	
	notifyOnEmpty = JSON.parse(response.data["notifyOnEmpty"]);
	notifyFirstDateFound = JSON.parse(response.data["notifyFirstDateFound"]);
	highligtherColour = response.data["highligtherColour"];
	
	console.log("chrome.extension.sendMessage highligtherColour " + highligtherColour);
	console.log("chrome.extension.sendMessage notifyFirstDateFound " + notifyFirstDateFound);
	console.log("chrome.extension.sendMessage notifyOnEmpty " + notifyOnEmpty);
	
	
	translateHighligtherColour();
	
	doChecks();
	
	// ----- Perform action when completed -----
	if (!found) {
		showNothingFoundNotification();
	} else {	
		showFoundNotification();
	}	

});

// ---------------------------------------------------------------------- Check for elements ----------------------------------------------------------------------
function doChecks() {
	console.log("do checks");
	var elementArray = [ 'td', 'th', 'span', 'p', 'div', 'li', 'time', 'h1', 'h2', 'h3', 'h4', 'h5', 'footer', 'a', 'font', 'b', ];
	//var elementArray = ['option'];
	for (var i = 0; i < elementArray.length; i++) {
		checkElementForDate(elementArray[i], stackoverflowregex, "stackoverflowregex");
		checkElementForDate(elementArray[i], codeprojectregex, "codeprojectregex");
		checkElementForDate(elementArray[i], coursera, "coursera");
		checkElementForDate(elementArray[i], yearregex, "yearregex");
		checkElementForDate(elementArray[i], essDateRegex, "essDateRegex");
		checkElementForDate(elementArray[i], date1Regex, "date1Regex");
		checkElementForDate(elementArray[i], gmailregex, "gmailregex");
		checkElementForDate(elementArray[i], fullMonthregex, "fullMonthregex");
		checkElementForDate(elementArray[i], dateAndTime, "dateAndTime");
		checkElementForDate(elementArray[i], dayAndTime, "dayAndTime");
		checkElementForDate(elementArray[i], hyphenDate, "hyphenDate");
		checkElementForDate(elementArray[i], compactDate, "compactDate");
		checkElementForDate(elementArray[i], ddmmyyyy, "ddmmyyyy");
		checkElementForDate(elementArray[i], ddmmyy, "ddmmyy");
		checkElementForDate(elementArray[i], longDateAndTime, "longDateAndTime");
	}
}

// ---------------------------------------------------------------------- Checking elements helper method ----------------------------------------------------------------------
function checkElementForDate(element, regex, description) {
	if (regex.test(document.body.innerText)) {
		$(element).filter(function() {
				if ($(this).children().length === 0) { // inner element 
					if ($(this).text().match(regex)) {
						// set the colour and background colour when a match was made
						found = true;
						applyStyles($(this));
						// get the position of the element so that we know which is first on the page
						var offset = $(this).offset();
						formatFirstDate($(this).text(), regex, offset.top);
					}
				} else if ($(this).children().length > 0) {
					if ($(this).text().match(regex) && (!($(this).children().text().match(regex)))) {
						// set the colour and background colour when a match was made
						found = true;
						// get the position of the element so that we know which is first on the page
						var offset = $(this).offset();
						formatFirstDate($(this).text(), regex, offset.top);
						var oldBackgroundColor = $(this).css("background-color");
						if (oldBackgroundColor === "rgba(0, 0, 0, 0)") {
							oldBackgroundColor = "rgba(0, 0, 0, 0)!important";
						}
						applyStyles($(this));
						$(this).children().css("background-color", oldBackgroundColor);					
					}
				}
		});
	}
};

function formatFirstDate(dateFound, regex, top) {
	if (firstDateFound && (firstDateFoundPosition < top)) {
		return;
	}
	firstDateFoundPosition = top;
	if (dateFound.length > 40) {
		var indexOfDate = dateFound.search(regex);
		if (indexOfDate > 15) {
			firstDateFound = "... " + dateFound.substr(indexOfDate-15, 30).trim() + " ...";
		} else {
			firstDateFound = dateFound.substr(indexOfDate, 30).trim() + " ...";
		}
	} else {
		firstDateFound = dateFound;
	}
}
					

// ---------------------------------------------------------------------- Helper methods to apply styles ----------------------------------------------------------------------
function applyStyles(obj) {
	obj.css("background-color", highligtherColour);
	obj.css("color", "black");
}

// ---------------------------------------------------------------------- Helper methods to show a webkit notification ----------------------------------------------------------------------
function showNothingFoundNotification() {
	if (notifyOnEmpty) {
		if (window.webkitNotifications.checkPermission() === 0) {
			var notification = window.webkitNotifications.createNotification(chrome.extension.getURL('48.png'), 'No dates found', '');
			notification.show();
		} else {
			window.webkitNotifications.requestPermission();
		}
	}
}

function showFoundNotification() {
	if (notifyFirstDateFound) {
		if (window.webkitNotifications.checkPermission() === 0) {
			var notification = window.webkitNotifications.createNotification(chrome.extension.getURL('48.png'), firstDateFound, '');
			notification.show();
		} else {
			window.webkitNotifications.requestPermission();
		}
	}
	
	var notification = window.webkitNotifications.createNotification(chrome.extension.getURL('48.png'), 'Done searching', '');
	notification.show();
}

// ---------------------------------------------------------------------- Helper methods to translate colour into css ----------------------------------------------------------------------
function translateHighligtherColour() {
	if (highligtherColour === "Blue") {
		highligtherColour = "lightskyblue";
	}
	if (highligtherColour === "Green") {
		highligtherColour = "lawngreen";
	}
	if (highligtherColour === "Pink") {
		highligtherColour = "hotpink";
	}
}
