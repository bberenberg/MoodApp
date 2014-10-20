var chart;

window.onload = function(e){
	var votes;
	votes = readLocalStorage();
	drawChart(votes);
}

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

		var score = last + direction; 
		votes.push([d,score]);
		localStorage["moodapp"] = JSON.stringify(votes);
		drawChart(votes);
	}
	else{
		console.log('No support for LocalStorage');
	}	
};

function readLocalStorage(){
	if(typeof(Storage)!=="undefined") {
		var localStorageRaw = JSON.parse(localStorage["moodapp"]);
		var localStorageClean = localStorageRaw;
		for (i=0; i <localStorageRaw.length; i++){
			var oldDate = localStorageRaw[i][0];
			var objectDate = new Date(oldDate);
			localStorageClean[i][0] = objectDate;
		};
		return localStorageClean;
	}
	else{   
                console.log('No support for LocalStorage');
        }
}

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
	document.getElementById('chart_parent_div').innerHTML = "";
	votes = [];
	localStorage["moodapp"] = "";
//	chart.clearChart();
}

window.onresize = function() {
	drawChart(votes);
};
