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
//var diagnostics = require('diagnostics');
var Settings = require('settings');
var timer = '';
functions.launch();
functions.settings();

//Load historical data
var votes = functions.readLocalStorage();

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
  timer = functions.timer(timer);
  //myLogger.debug('vote up');
});

main.on('click', 'down', function(e) {
  vote(-1);
  timer = functions.timer(timer);
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
  var d = new Date();
  votes.push([d,direction]);
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
}



//builds the main content
function mainContent(){
  //myLogger.debug('building the main page');
  bodyContent = '';
  if (votes[0] === null){
    bodyContent = defaultBody;
  } else {
    bodyContent = 'Todays mood sum is: ' + functions.sumScore(votes,functions.startOfDay())[0] + ' and average score is: ' + functions.avgScore(votes, functions.startOfDay()) + '%';                     
  }
  return bodyContent;
}


//builds out the menu contents
function buildMenu(menu){
  //myLogger.debug('building the menu');
  menu.item(0, 0, { title: '1 day avg (' + functions.avgScore(votes, functions.timeHop(1)) + '%)' });
  menu.item(0, 1, { title: '7 day avg (' + functions.avgScore(votes, functions.timeHop(7)) + '%)' });
  menu.item(0, 2, { title: '30 day avg (' + functions.avgScore(votes, functions.timeHop(30)) + '%)' });
  menu.item(0, 3, { title: 'Delete History' });
  menu.item(0, 4, { title: 'Data Generator' });
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
  } else if (e.itemIndex == 3) {
    votes.length = 0;
    localStorage.setItem("moodapp", JSON.stringify(votes));
    main.body(mainContent());
    buildMenu(menu);
  } else if (e.itemIndex == 4) {
    controlledGenerator(menu);
  }
}

function dataGenerator(menu){
  //myLogger.debug('data generator');
  // functions.schedule();
  votes.length = 0;
  for (var i = 0; i < 100; i++){
      var d = functions.timeHop((Math.floor(Math.random() * 30) + 1 ));
      var direction = Math.random() < 0.5 ? 1 : -1;
      votes.push([d,direction]);
  }
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
  buildMenu(menu);
}

function controlledGenerator(menu){
  votes.length = 0;
  for (var i = 0; i < 30; i++){
      var d = functions.timeHop(i);
      var direction = Math.random() < 0.5 ? 1 : -1;
      votes.push([d,direction]);
  }
  localStorage.setItem("moodapp", JSON.stringify(votes));
  main.body(mainContent());
  buildMenu(menu);
}


Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
};