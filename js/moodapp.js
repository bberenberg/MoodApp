var chart;

document.onkeydown = function(e){
	switch (e.keyCode){
		case 38:
			vote(1);
			break;
		case 40:
			vote(-1);
			break;
	}
};

google.load("visualization", "1", {packages:["annotationchart"]});
google.setOnLoadCallback(drawChart);

var votes = [];
function vote(direction){
	if(typeof(Storage)!=="undefined") {
		var d = new Date();
		var last = 0;
		if (votes.length != 0){
			last = votes[votes.length -1][1];
		};
//		if (localStorage.getitem("moodapp") === null){
//			console.log(JSON.parse(localStorage["moodapp"]));
//		};
console.log(d);
		var score = last + direction; 
		votes.push([d,score]);
		localStorage["moodapp"] = JSON.stringify(votes);
		drawChart(votes);
	}
	else{
		console.log('No support for LocalStorage');
	}	
};

function drawChart(dataset){
  var data = new google.visualization.DataTable();
	data.addColumn('datetime','Timestamp');
	data.addColumn('number','Mood');
        var options = {
		thickness:3	
        };


	data.addRows(dataset);

        chart = new google.visualization.AnnotationChart(document.getElementById('chart_parent_div'));
	
	document.getElementById('chart_parent_div').innerHTML = "";	
        chart.draw(data, options);
};

function clearChart(){
	chart.clearChart();
}

window.onresize = function() {
	drawChart(votes);
};
