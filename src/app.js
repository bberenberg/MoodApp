/**
 * Mood App
 *
 * Written by Boris Berenberg / http://tin.cr
 */

//Static stuff
var defaultBody = 'Press up and down to indicate mood, and select to see the menu';

var UI = require('ui');

var votes = readLocalStorage();

var bodyContent = mainContent();

var main = new UI.Card({  
  title: 'Mood App',
  icon: 'images/menu_icon.png',
  body: bodyContent
});

main.show();

main.on('click', 'up', function(e) {
  vote(1);
});

main.on('click', 'down', function(e) {
  vote(-1);
});

main.on('click', 'select', function(e) {
  var menu = new UI.Menu();
  menu = buildMenu(menu);
  menu.on('select', function(e) {
    if (e.itemIndex == 3){
      votes.length = 0;
      localStorage.setItem("moodapp", JSON.stringify(votes));
      main.body(mainContent());
      buildMenu(menu);
    }
  });
  menu.on('back', function(e) {
    main.body(mainContent());
  });
  menu.show();
});

main.on('show', function() {
  mainContent();
});


function vote(direction){
  var d = new Date();
  votes.push([d,direction]);
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
}

function readLocalStorage(){
	var localStorageRaw = JSON.parse(localStorage.getItem("moodapp"));
	var localStorageClean = localStorageRaw;
	if (localStorageRaw && localStorageRaw.length) {
    for (i=0; i <localStorageRaw.length; i++){
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

function avgScore(date){
  var score = 0;
  var sum = sumScore(date);
  console.log(sum[0]+' '+sum[1]);
  if (sum[1]){
    score = Math.round(((sum[0] / sum[1] * 100) + 100) / 2);
  } else {
    score = 50;
  }
  
  return score;
}

function sumScore(date){
  var sum = 0;
  var counter = 0;
  if (votes && votes.length){
    for (i=0; i <votes.length; i++){
      if (votes[i][0].getTime() > date.getTime()){
        sum = sum + votes[i][1];
        counter = counter + 1;
      }
    }
  }
  return [sum, counter];
}

function mainContent(){
  bodyContent = '';
  if (votes[0] === null){
    bodyContent = defaultBody;
  } else {
    bodyContent = 'Todays mood sum is: ' + sumScore(startOfDay())[0] + ' and average score is: ' + avgScore(startOfDay()) + '%';                     
  }
  return bodyContent;
}

function startOfDay(){
  var start = new Date();
  start.setHours(0,0,0,0);
  return start;
}

function timeHop(days){
  var hop = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));
  return hop;
}

function buildMenu(menu){
  menu.item(0, 0, { title: '1 day avg (' + avgScore(timeHop(1)) + '%)' });
  menu.item(0, 1, { title: '7 day avg (' + avgScore(timeHop(7)) + '%)' });
  menu.item(0, 2, { title: '30 day avg (' + avgScore(timeHop(30)) + '%)' });
  menu.item(0, 3, { title: 'Delete History' });
  return menu;
}