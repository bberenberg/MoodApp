var UI = require('ui');
var functions = module.exports;
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Light = require('ui/light');
var Wakeup = require('wakeup');

//gives us a date object N number of days in the past
functions.timeHop = function(days) {
  //myLogger.debug('starting timehop');
  var hop = new Date(functions.startOfDay() - (days * 24 * 60 * 60 * 1000));
  return hop;
};

//figures out when today started
functions.startOfDay = function(){
  //myLogger.debug('Finding start of day');
  var start = new Date();
  start.setHours(0,0,0,0);
  return start;
};


//finds the sum score
functions.sumScore = function(votes,pastDate){
 // myLogger.debug('summing the votes');
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
  //myLogger.debug('avg the scores');
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
  //myLogger.debug('read the local storage');
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
      Settings.option('reminderInterval', '0');
      Settings.option('reminderIntervalUnit', '0');
      Settings.option('vibration', true);
      Settings.option('light', true);
      Settings.option('reminderMode', '1');
    },
    function(e) {
      console.log('closed configurable');
      // Show the parsed response
      console.log(JSON.stringify(e.options));
      timer = functions.timer();
      // Show the raw response if parsing failed
      if (e.failed) {
        console.log(e.response);
      }
    }
  ); 
};

functions.alert = function(){
  var settings = Settings.option();
  //myLogger.debug('triggering alert');
  if (settings.light){
    Light.trigger();
  }
  if (settings.vibrate){
    Vibe.vibrate('short');
  }
};

functions.schedule = function(){
  //myLogger.debug('schedule the next wakeup');
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
      if (!timer){
        // FIX THIS SHIT IT IS BROKEN
        timer = functions.timer();
      }
      var myLogger = functions.Logger();
      myLogger.level = 'debug';
      myLogger.debug('test logging output');
    }
  });
};

functions.timer = function(timer){
  //myLogger.debug('entered timer function');
  if (timer){
    clearInterval(timer);
    console.log('cleared timer');
  }
  var settings = Settings.option();
  if (settings.reminderMode != "noReminders"){
    timer = setInterval(functions.alert, settings.reminderInterval*60000*settings.reminderIntervalUnit);
    console.log('started new timer');
    return timer;
  }
};


functions.dataGenerator = function(votes){
  //myLogger.debug('data generator');
  // functions.schedule();
  votes.length = 0;
  for (var i = 0; i < 100; i++){
      var d = functions.timeHop((Math.floor(Math.random() * 30) + 1 ));
      var direction = Math.random() < 0.5 ? 1 : -1;
      votes.push([d,direction]);
  }
  localStorage.setItem("moodapp", JSON.stringify(votes));
};

functions.controlledGenerator = function(votes){
  votes.length = 0;
  for (var i = 0; i < 30; i++){
      var d = functions.timeHop(i);
      var direction = Math.random() < 0.5 ? 1 : -1;
      votes.push([d,direction]);
  }
  localStorage.setItem("moodapp", JSON.stringify(votes));
};
