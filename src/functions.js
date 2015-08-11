var UI = require('ui');
var functions = module.exports;
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Light = require('ui/light');
var Wakeup = require('wakeup');

//gives us a date object N number of days in the past
functions.timeHop = function(days) {
  var hop = new Date(functions.startOfDay() - (days * 24 * 60 * 60 * 1000));
  return hop;
};

//figures out when today started
functions.startOfDay = function(){
  var start = new Date();
  start.setHours(0,0,0,0);
  return start;
};

functions.printVotes =function(array){
  for (var i = 0; i < array.length; i++){
    console.log(array[i][0] + '  ' + array[i][1]);
  }
};


//finds the sum score
functions.sumScore = function(votes,pastDate){
  var sum = 0;
  var counter = 0;
  if (votes && votes.length){
    for (var i=0; i <votes.length; i++){
      if (votes[i][0].getTime() > pastDate.getTime()){
        sum = sum + votes[i][1];
        counter = counter + 1;
      }
    }
  }
  return [sum, counter];
};

//finds the % score
functions.avgScore = function(votes,date){
  var score = 0;
  var sum = functions.sumScore(votes,date);
  if (sum[1]){
    score = Math.round(((sum[0] / sum[1] * 100) + 100) / 2);
  } else {
    score = 50;
  }
  return score;
};

//Reads in local storage for use
functions.readLocalStorage = function(){
	var localStorageRaw = JSON.parse(localStorage.getItem("moodapp"));
	var localStorageClean = localStorageRaw;
	if (localStorageRaw && localStorageRaw.length) {
    for (var i=0; i <localStorageRaw.length; i++){
      var oldDate = localStorageRaw[i][0];
      var objectDate = new Date(oldDate);
      localStorageClean[i][0] = objectDate;
    }
  }
  if (localStorageClean && localStorageClean.length) {
    return localStorageClean;
  } else {
    var votes = [];
    return votes;
  }
};

functions.settings = function(){
  Settings.config(
    { url: 'http://tin.cr/moodapp/config/index.html' },
    function(e) {
      console.log('opening configurable');

      // Reset color to red before opening the webview
      Settings.option('reminder', '1');
    },
    function(e) {
      console.log('closed configurable');

      // Show the parsed response
      console.log(JSON.stringify(e.options));
      
      // Show the raw response if parsing failed
      if (e.failed) {
        console.log(e.response);
      }
    }
  ); 
};

functions.alert = function(){
  Light.trigger();
  Vibe.vibrate('short');
  console.log('alert');
};

functions.schedule = function(){
  Wakeup.schedule(
    {
      // Set the wakeup event for one minute from now
      time: Date.now() / 1000 + 60,
      // Pass data for the app on launch
      data: { hello: 'world' }
    },
    function(e) {
      if (e.failed) {
        // Log the error reason
        console.log('Wakeup set failed: ' + e.error);
      } else {
        console.log('Wakeup set! Event ID: ' + e.id);
      }
    }
  );
};

functions.launch = function(){
  Wakeup.launch(function(e) {
    if (e.wakeup) {
      console.log('Woke up to ' + e.id + '! data: ' + JSON.stringify(e.data));
    } else {
      console.log('Regular launch not by a wakeup event.');
      console.log('Pebble Account Token: ' + Pebble.getAccountToken());
      console.log('Pebble Watch Token: ' + Pebble.getWatchToken());
    }
  });
}

functions.timer = function(){
  console.log('test');
  var settings = Settings.option();
  var timer = setInterval(functions.alert(), settings.reminder*100);
  setTimeout(function(){ clearInterval(timer); console.log('cleared'); }, 30000);
}

functions.test = function(){
  console.log('test');
}