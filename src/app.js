/**
 * Mood App
 *
 * Written by Boris Berenberg / http://tin.cr
 * 
 */

//Static stuff
var defaultBody = 'Press up and down to indicate mood, and select to see the menu';
var UI = require('ui');
var draw = require('graphing');
var functions = require('functions');
var Settings = require('settings');

//require('firebase230'); 
//Firebase.INTERNAL.forceWebSockets(); 
//var ref = new Firebase("https://moodapp.firebaseio.com");  


var timer;
var midnightTimer;
functions.launch();
functions.settings();

//Load historical data
var votes = functions.readLocalStorage();

//Populate the initial launch page with content
var bodyContent = mainContent();

//build the contents of the launch page
var main = new UI.Card({  
  title: 'Mood App',
  icon: 'images/mood28.png',
  body: bodyContent,
  //needs the icons I think? Causes blank page in the current form.
  action: {
    up: 'images/plusd.png',
    down: 'images/minusd.png',
    select: 'images/arrowd.png'
  } 
});

//Show the launch page
main.show();

//Handle voting up and down
main.on('click', 'up', function(e) {
  vote(1);
  functions.timer();
  //myLogger.debug('vote up');
});

main.on('click', 'down', function(e) {
  vote(-1);
  functions.timer();
  //myLogger.debug('vote down');
});

//Menu handler
main.on('click', 'select', function(e) {
  var menu = new UI.Menu();
  menu = buildMenu(menu);
  menu.on('select', function(e) {
    handleMenu(menu, e);
  });
  menu.on('back', function(e) {
    main.body(mainContent());
  });
  menu.show();
  //myLogger.debug('menu opened');
});

//Refreshes main content window I think? May be totally useless. Need to try removing this.
main.on('show', function() {
  mainContent();
});

//Handle the input to data for voting
function vote(direction){
  //myLogger.debug('writing votes');
  var location = getCurrentLocation();
  var d = new Date();
  votes.push([d, direction, location, location.lat, location.lon]);
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
  midnightReset();
  //var usersRef = ref.child(String(Pebble.getAccountToken()));
  //usersRef.set(JSON.stringify(votes));
}

//builds the main content
function mainContent(){
  //myLogger.debug('building the main page');
  bodyContent = '';
  if (votes[0] === null){
    bodyContent = defaultBody;
  } else {
    bodyContent = 'Todays mood score is: ' + functions.sumScore(votes,functions.startOfDay())[0];                     
  }
  return bodyContent;
}

//builds out the menu contents
function buildMenu(menu){
  //myLogger.debug('building the menu');

  menu.item(0, 0, { title: 'Yesterday (' + functions.sumScore(votes, functions.timeHop(1))[0] + ')' });
  menu.item(0, 1, { title: '7 day score (' + functions.sumScore(votes, functions.timeHop(7))[0] + ')' });
  menu.item(0, 2, { title: '30 day score (' + functions.sumScore(votes, functions.timeHop(30))[0] + ')' });
  //menu.item(0, 3, { title: 'Data Generator' });
  //menu.item(0, 4, { title: 'Delete History' });
  return menu;
}

//handles the inputs for the menu
function handleMenu(menu, e){
  //myLogger.debug('handle the menu');
  if (e.itemIndex === 0) {
    draw.graph(votes,1,24);
  } else if (e.itemIndex == 1) {
     draw.graph(votes,7,7);
  } else if (e.itemIndex == 2) {
     draw.graph(votes,30,30);
  } else if (e.itemIndex == 4) {
    votes.length = 0;
    localStorage.setItem("moodapp", JSON.stringify(votes));
    main.body(mainContent());
    buildMenu(menu);
  } else if (e.itemIndex == 3) {
    functions.dataGenerator(votes);
    main.body(mainContent());
    buildMenu(menu);
  }
}

function getCurrentLocation(){
  var result = 0;
  var locationOptions = {
    enableHighAccuracy: true, 
    maximumAge: 10000, 
    timeout: 10000
  };
  function locationSuccess(pos) {
    console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
    result = {lat: pos.coords.latitude, lon: pos.coords.longitude};
  }
  function locationError(err) {
    console.log('location error (' + err.code + '): ' + err.message);
  }
  navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  return result;
}

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
};

function midnightReset() {
  var now = new Date();
  var night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0 
  );
  var msTillMidnight = night.getTime() - now.getTime();
  midnightTimer = setTimeout(function(){ main.body(mainContent()) }, msTillMidnight);
}