var UI = require('ui');
var Vector2 = require('vector2');
var functions = require('functions');
var draw = module.exports;

//bin the numbers into a histogram, and draw the graph
draw.graph = function (votes,days,segments){
  var graph = new UI.Window();
  var background = new UI.Rect({ size: new Vector2(144, 168) });
  var xAxis = new UI.Rect({ position: new Vector2(0,72), size: new Vector2(144, 1), backgroundColor: 'black'});
  var barWidth = 144 / segments;
  graph.add(background);
  
  for (var i = 0; i < votes.length; i++){
    console.log(votes[i][0].getDate());
  }
  
  //get just the scores for the time period we are looking at
  var segmentScores = [];
  for (var i = votes.length - 1; i >= 0; i--){
    if (votes[i][0] > functions.timeHop(days)){
      console.log(votes[i]);
      segmentScores.push(votes[i]);
    }
  }
  
  
  
  //bin the scores  
  var results = [];
  if (days == 1){
    segmentScores.forEach(function(score) {
      var hour = score[0].getHours() + 1;
      console.log(hour);
      results[hour] = (results[hour] || 0) + score[1];
    });
  } else {
    segmentScores.forEach(function(score) {
      var day = score[0].getDate();
      results[day] = (results[day] || 0) + score[1];
      console.log(day + ' ' + results[day]);
    });
  }
  //draw the scores
  var columns = {};
  for (var i = 0; i <= segments; i++){
    if (results[i]){
      console.log(results[i]);
      columns[i] = new UI.Rect({ position: new Vector2(barWidth * (i - 1), 72), size: new Vector2(barWidth, (-12 * results[i])), borderColor: 'black', backgroundColor: 'white' });
      graph.add(columns[i]);
    }
  }
  graph.add(xAxis);
  graph.show();
};