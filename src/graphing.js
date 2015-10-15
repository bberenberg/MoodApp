var UI = require('ui');
var Vector2 = require('vector2');
var functions = require('functions');
var draw = module.exports;

//bin the numbers into a histogram, and draw the graph
draw.graph = function (votes,intervals,segments){
  var graph = new UI.Window();
  var background = new UI.Rect({ size: new Vector2(144, 168) });
  var xAxis = new UI.Rect({ position: new Vector2(0,68), size: new Vector2(144, 1), backgroundColor: 'black'});
  var barWidth = 144 / segments;
  graph.add(background);
  
  
  //get just the scores for the time period we are looking at
  var segmentScores = [];
  var firstInterval = functions.timeHop(intervals);
  var end;
  if (intervals === 0){
    end = functions.timeHop(-1);
  } else {
    end = functions.startOfDay();
  }
  for (var i = votes.length - 1; i >= 0; i--){
    if (votes[i][0] >= firstInterval && votes[i][0] < end ){
      segmentScores.push({timestamp: votes[i][0], score: votes[i][1]});
      console.log(votes[i][0] + ' ' + votes[i][1]);
    }
  }

  var results = [];
  for (i = segments ; i > 0; i--){
    if (intervals == 1){
      results.push({timestamp: functions.startOfDay().addHours(-i), score: 0});
    } else if (intervals === 0){
      results.push({timestamp: functions.startOfDay().addHours(24-i), score: 0});
    } else {
      results.push({timestamp: functions.timeHop(i), score: 0});
    }
  }
  

  results.forEach(function(result, arrIndex){
    var sum = 0;
    segmentScores.forEach(function(segment){
      if (intervals == 1 || intervals === 0){
        if (segment.timestamp.getHours() == result.timestamp.getHours()){
          sum = sum + segment.score;
        }
      } else {
        if (segment.timestamp.getDate() == result.timestamp.getDate()){
          sum = sum + segment.score;
        }
      }
    });
    results[arrIndex].score = sum;
  });

  
  results.sort(function(a, b){
    return a.timestamp-b.timestamp;
  });
  
  var max = 0;
  var min = 0;
  for (i = 0; i < results.length; i++){
    if (results[i].score > max){
      max = results[i].score;
    }
    else if (results[i].score < min){
      min = results[i].score;
    }
  }
  var range = max - min;
  //draw the scores

  results.forEach(function(item, arrIndex){
      var column = new UI.Rect({ position: new Vector2(barWidth * arrIndex, 68), size: new Vector2(barWidth, (-1 * item.score * 68 / range)), borderColor: 'black', backgroundColor: 'white' });
      graph.add(column);
  });
  
  var midnight = functions.timeHop(1);
  var dateRange;
  if (intervals == 1 || intervals === 0){
    dateRange = firstInterval.getMonth() + '/' + firstInterval.getDate();
  } else {
    dateRange = firstInterval.getMonth() + '/' + firstInterval.getDate() + ' - ' +  midnight.getMonth() + '/' + midnight.getDate();
  }
  var dateBar = new UI.Text({text: dateRange, textAlign: "center", backgroundColor: "black", position: new Vector2(0, 136), size: new Vector2(144, 16), font: 'gothic-14'});
  graph.add(xAxis);
  graph.add(dateBar);
  graph.show(); 
}; 