var UI = require('ui');
var functions = module.exports;
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Light = require('ui/light');
var Wakeup = require('wakeup');
var timer;



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
functions.sumScore = function(votes,pastDate, endDate){
 // myLogger.debug('summing the votes');
  var sum = 0;
  var counter = 0;
  if (votes && votes.length){
    for (var i=0; i <votes.length; i++){
      if (votes[i][0].getTime() > pastDate.getTime() && votes[i][0].getTime() < endDate){
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
      var votes = functions.readLocalStorage();
      console.log('opening configurable');
      //Settings.option('accountToken', String(Pebble.getAccountToken()));
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
    console.log('alert light');
  }
  if (settings.vibration){
    Vibe.vibrate('short');
    console.log('alert vibe');
  }
  if (settings.reminderMode == "randomReminders"){
    clearInterval(timer);
    var temp = getRandomInt(20,120)*60000;
    var now = Date.now();
    console.log('now ' + now);
    console.log('interval ' + temp);
    console.log('expected ' + now + temp);
    timer = setInterval(functions.alert, temp);
    return timer;
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
      functions.timer();
      functions.defaultSettings();
      //var myLogger = functions.Logger();
      //myLogger.level = 'debug';
      //myLogger.debug('test logging output');
    }
  });
};

functions.timer = function(){
  //myLogger.debug('entered timer function');
  if (timer){
    clearInterval(timer);
    console.log('cleared timer');
  }
  var settings = Settings.option();
  if (settings.reminderMode == "timeReminders"){
    timer = setInterval(functions.alert, settings.reminderInterval*60000*settings.reminderIntervalUnit);
    return timer;
  }
  else if (settings.reminderMode == "randomReminders"){
    var temp = getRandomInt(20,120)*60000;
    var now = Date.now();
    console.log('now ' + now);
    console.log('interval ' + temp);
    console.log('expected ' + now + temp);
    timer = setInterval(functions.alert, temp);
    return timer;
  }
  else{
    clearInterval(timer);
    console.log('cleared timer');
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

functions.defaultSettings = function(){
  if(!Settings.option('reminderInterval')){
    Settings.option('reminderInterval', 0);
  }
  if(!Settings.option('light')){
    Settings.option('light',true);
  }
  if(!Settings.option('vibration')){
    Settings.option('vibration', true);
  }
  if(!Settings.option('location')){
    Settings.option('location', true);
  }
  if(!Settings.option('reminderIntervalUnit')){
    Settings.option('reminderIntervalUnit',1);
  }
  if(!Settings.option('reminderMode')){
    Settings.option('reminderMode','noReminders');
  }
  var options = Settings.option();
  console.log(JSON.stringify(options));
};