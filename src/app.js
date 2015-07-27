/**
 * Mood App
 *
 * Written by Boris Berenberg / http://tin.cr
 */

var UI = require('ui');

var votes = readLocalStorage();

//REMOVE THIS LINE BEFORE RELEASING
var votes = [];

var bodyContent = mainContent();

var main = new UI.Card({  
  title: 'Mood App',
  icon: 'images/menu_icon.png',
  body: bodyContent
});

main.show();

main.on('click', 'up', function(e) {
  vote(1);
  mainContent();
  main.show();
});

main.on('click', 'down', function(e) {
  vote(-1);
  mainContent();
  main.show();
});

main.on('click', 'select', function(e) {
  votes = readLocalStorage();
  var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  var week = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
  var month = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
  
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: '1 day avg (' + avgScore(yesterday) + ')'
      }, {
        title: '7 day avg (' + avgScore(week) + ')'
      }, {
        title: '30 day avg (' + avgScore(month) + ')'
      }, {
        title: 'Delete History'
      }]
    }]
  });
  menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});



function vote(direction){
  var d = new Date();
  votes.push([d,direction]);
  localStorage.setItem("moodapp", JSON.stringify(votes));
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
  score = sum[0] / sum[1];
  return score;
}

function sumScore(date){
  var sum = 0;
  var counter = 0;
  if (votes && votes.length){
    for (i=0; i <votes.length; i++){
      if (votes[i][0].getTime() > date.getTime()){
        console.log(votes[i][1]);
        sum = sum + votes[i][1];
        counter++;
      }
    }
  }
  return [sum, counter];
}

function mainContent(){
  var defaultBody = 'Press up and down to indicate mood, and select to see the menu';
  bodyContent = '';
  if (votes == []){
    bodyContent = defaultBody;
  } else {
    bodyContent = 'Sum score from the start of the day is: ' + sumScore(moment().startOf('day'))[1];                     
  }
  return bodyContent;
}