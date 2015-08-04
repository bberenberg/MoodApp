/**
 * Mood App
 *
 * Written by Boris Berenberg / http://tin.cr
 * 
 */

//Static stuff
var defaultBody = 'Press up and down to indicate mood, and select to see the menu';
var UI = require('ui');
var Vector2 = require('vector2');

//Load historical data
var votes = readLocalStorage();

//Populate the initial launch page with content
var bodyContent = mainContent();

//build the contents of the launch page
var main = new UI.Card({  
  title: 'Mood App',
  icon: 'images/menu_icon.png',
  body: bodyContent
  //needs the icons I think? Causes blank page in the current form.
  /*  action: {
    up: 'images/action_icon_plus.png',
    down: 'images/action_icon_minus.png'
  } */
});

//Show the launch page
main.show();

//Handle voting up and down
main.on('click', 'up', function(e) {
  vote(1);
});

main.on('click', 'down', function(e) {
  vote(-1);
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
});

//Refreshes main content window I think? May be totally useless. Need to try removing this.
main.on('show', function() {
  mainContent();
});

//Handle the input to data for voting
function vote(direction){
  var d = new Date();
  votes.push([d,direction]);
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
}

//Reads in local storage for use
function readLocalStorage(){
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
    votes = [];
    return votes;
  }
}

//finds the % score
function avgScore(date){
  var score = 0;
  var sum = sumScore(date);
  if (sum[1]){
    score = Math.round(((sum[0] / sum[1] * 100) + 100) / 2);
  } else {
    score = 50;
  }
  
  return score;
}

//finds the sum score
function sumScore(pastDate){
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
}

//builds the main content
function mainContent(){
  bodyContent = '';
  if (votes[0] === null){
    bodyContent = defaultBody;
  } else {
    bodyContent = 'Todays mood sum is: ' + sumScore(startOfDay())[0] + ' and average score is: ' + avgScore(startOfDay()) + '%';                     
  }
  return bodyContent;
}

//figures out when today started
function startOfDay(){
  var start = new Date();
  start.setHours(0,0,0,0);
  return start;
}

//gives us a date object N number of days in the past
function timeHop(days){
  var hop = new Date(startOfDay() - (days * 24 * 60 * 60 * 1000));
  return hop;
}

//builds out the menu contents
function buildMenu(menu){
  menu.item(0, 0, { title: '1 day avg (' + avgScore(timeHop(1)) + '%)' });
  menu.item(0, 1, { title: '7 day avg (' + avgScore(timeHop(7)) + '%)' });
  menu.item(0, 2, { title: '30 day avg (' + avgScore(timeHop(30)) + '%)' });
  menu.item(0, 3, { title: 'Delete History' });
  menu.item(0, 4, { title: 'Data Generator' });
  return menu;
}

//handles the inputs for the menu
function handleMenu(menu, e){
  if (e.itemIndex === 0) {
    drawGraph(1,24);
  } else if (e.itemIndex == 4) {
    dataGenerator(menu);
  } else if (e.itemIndex == 3) {
    votes.length = 0;
    localStorage.setItem("moodapp", JSON.stringify(votes));
    main.body(mainContent());
    buildMenu(menu);
  }
}

//bin the numbers into a histogram, and draw the graph
function drawGraph(days,segments){
  var graph = new UI.Window();
  var background = new UI.Rect({ size: new Vector2(144, 168) });
  var barWidth = 144 / segments;
  graph.add(background);
  
  //get just the scores for the time period we are looking at
  var segmentScores = [];
  for (var i=votes.length - 1; i >= 0; i--){
    if (votes[i][0] > timeHop(days)){
      segmentScores.push(votes[i]);
    }
  }
  printVotes(segmentScores);
  //bin the scores
/*  var binnedScores = {};
  binnedScores[0] = 0;
  for (var s = 1; s <= segments; s++){
    console.log('s-1 log ' + (s-1));
    for (var i = 0; i < segmentScores.length; i++){
      var scoreDate = segmentScores[i][0];
      if (scoreDate >= timeHop(days).addHours((24/segments)*(s-1)) && scoreDate < timeHop(days).addHours((24/segments)*(s-1)+1)){
        console.log('before ' + (s-1) + ' sum: ' + binnedScores[s] + ' plus ' + segmentScores[i][1]);
        //binnedScores is being lame for some reason and being a NaN
        binnedScores[(s-1)] = binnedScores[(s-1)] + segmentScores[i][1];
        console.log('after ' + (s-1) + ' ' + binnedScores[(s-1)]);
      }
    }
  }
  for (var i = 0; i < binnedScores.length; i++){
    console.log(i + ' ' + binnedScores[i]);
  } */
  
  var hourlyScores = {};
  segmentScores.forEach(function(score) {
    var hour = score[0].getHours();
    hourlyScores[hour] = (hourlyScores[hour] || 0) + score[1];
  });
  
  //draw the scores
  var columns = {};
  for (var i = 0; i < segments; i++){
    if (hourlyScores[i]){
      columns[i] = new UI.Rect({ position: new Vector2(barWidth * i, 72), size: new Vector2(barWidth, (12 * hourlyScores[i])), borderColor: 'black', backgroundColor: 'white' });
      graph.add(columns[i]);
      console.log('upper left x ' + (barWidth * i) + ' upper left y 72 bottom right x ' + (barWidth * (i+1)) + ' bottom right y ' + (72 + (12 * hourlyScores[i])));
    }
  }
  graph.show();
}

function dataGenerator(menu){
  votes.length = 0;
  for (var i = 0; i < 20; i++){
      var d = timeHop(1/(Math.floor(Math.random() * 24) + 1 ));
      var direction = Math.random() < 0.5 ? 1 : -1;
      votes.push([d,direction]);
  }
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
  buildMenu(menu);
}

function printVotes(array){
  for (var i = 0; i < array.length; i++){
    console.log(array[i][0] + '  ' + array[i][1]);
  }
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
};