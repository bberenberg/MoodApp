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

require('firebase230'); 
Firebase.INTERNAL.forceWebSockets(); 

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
  var location = getCurrentLocation(function (err, location) {
    if (err) {
    }
    var d = new Date();
    if (Settings.option('location')){
      votes.push([d,direction,location.lat, location.lon]);
    } else{
      votes.push([d,direction]);
    }
    localStorage.setItem("moodapp", JSON.stringify(votes));
    main.body(mainContent());
    setTimeout(midnightReset,0);
    setTimeout(firebasePush,0);
  });
}

//builds the main content
function mainContent(){
  //myLogger.debug('building the main page');
  bodyContent = '';
  if (votes[0] === null){
    bodyContent = defaultBody;
  } else {
    bodyContent = 'Todays mood score is: ' + functions.sumScore(votes,functions.startOfDay(), functions.timeHop(-1))[0];                     
  }
  console.log('midnight reset');
  return bodyContent;
}

//builds out the menu contents
function buildMenu(menu){
  //myLogger.debug('building the menu');
  var start = functions.startOfDay();
  menu.item(0, 0, { title: 'Today (' + functions.sumScore(votes, start, functions.timeHop(-1))[0] + ')' });
  menu.item(0, 1, { title: 'Yesterday (' + functions.sumScore(votes, functions.timeHop(1), start)[0] + ')' });
  menu.item(0, 2, { title: '7 day score (' + functions.sumScore(votes, functions.timeHop(7), start)[0] + ')' });
  menu.item(0, 3, { title: '30 day score (' + functions.sumScore(votes, functions.timeHop(30), start)[0] + ')' });
  menu.item(0, 4, { title: 'Data Generator' });
  menu.item(0, 5, { title: 'Delete History' });
  return menu;
}

//handles the inputs for the menu
function handleMenu(menu, e){
  //myLogger.debug('handle the menu');
  if (e.itemIndex == 1) {
    draw.graph(votes,1,24);
  } else if (e.itemIndex == 2) {
     draw.graph(votes,7,7);
  } else if (e.itemIndex == 3) {
     draw.graph(votes,30,30);
  } else if (e.itemIndex == 5) {
    votes.length = 0;
    localStorage.setItem("moodapp", JSON.stringify(votes));
    main.body(mainContent());
    buildMenu(menu);
  } else if (e.itemIndex == 4) {
    //functions.dataGenerator(votes);
    //functions.controlledGenerator(votes);
    firebasePull();
    main.body(mainContent());
    buildMenu(menu);
  } else if (e.itemIndex === 0) {
     draw.graph(votes,0,24);
  }
}

function getCurrentLocation(callback){
  var locationOptions = {
    enableHighAccuracy: true, 
    maximumAge: 10000, 
    timeout: 10000
  };
  function locationSuccess(pos) {
    callback(null, {lat: pos.coords.latitude, lon: pos.coords.longitude});
  }
  function locationError(err) {
    callback(err);
  }
  navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
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
  console.log(msTillMidnight);
  midnightTimer = setTimeout(function(){main.body(mainContent());}, msTillMidnight);
}

function firebasePush(){
  var ref = new Firebase("https://moodapp.firebaseio.com");  
  ref.authWithPassword({
    email    : "test@example.com",
    password : "test"
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      var usersRef = ref.child("users");
      var scores = {};
      scores = {scores: votes};
      console.log('1');
      var userRef = usersRef.child(authData.uid);
      userRef.once("value", function(data) {
        if (data.val()){
          userRef.update(scores);
        }
        else {
          userRef.set(scores);
        }
      });
    }
  });
}

function firebasePull(){
  var ref = new Firebase("https://moodapp.firebaseio.com");  
  ref.authWithPassword({
    email    : "test@example.com",
    password : "test"
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      var usersRef = ref.child("users");
      var userRef = usersRef.child(authData.uid);
      userRef.on("value", function(snapshot, prevChildKey){
        votes = snapshot.val().scores;
        for (var i=0; i <votes.length; i++){
          votes[i][0] = new Date(votes[i][0]);  
          //THIS IS WHERE WE FIX IT
        }
      });
    }
  });
}