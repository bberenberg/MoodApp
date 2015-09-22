var reminderMode = "none";
$('.reminderOptionButtons').on('click', selectSection);


function selectSection (e){
  var target = e.target;
  var section = target.id;
  reminderMode = section;
  setSection(section);
}

function setSection (section){
  $('#reminderOptions').attr('data-section',section);
}

function getConfigData() {
  var reminderIntervalUnit = document.getElementById('reminderIntervalUnitSelector');
  var reminderInterval = document.getElementById('reminderInterval');
  var vibrationToggle = document.getElementById("vibration");
  var lightToggle = document.getElementById("light");
  var locationToggle = document.getElementById("location");
  var reminderModeSelector = $(".tab-button.active");
  // this is returning undefined, figure out why

  var options = {
    'reminderInterval': reminderInterval.value,
    'vibration': vibrationToggle.checked,
    'light': lightToggle.checked,
    'location': locationToggle.checked,
    'reminderIntervalUnit': reminderIntervalUnit.value,
    'reminderMode': reminderModeSelector.attr('id')
  };

  // Save for next launch
  localStorage['reminderInterval'] = options['reminderInterval'];
  localStorage['light'] = options['light'];
  localStorage['vibration'] = options['vibration'];
  localStorage['location'] = options['location'];
  localStorage['reminderIntervalUnit'] = options['reminderIntervalUnit'];
  localStorage['reminderMode'] = options['reminderMode'];

  console.log('Got options: ' + JSON.stringify(options));
  return options;
}

function getQueryParam(variable, defaultValue) {
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return defaultValue || false;
}

var submitButton = document.getElementById('submit_button');
submitButton.addEventListener('click', function() {
  console.log('Submit');
  // Set the return URL depending on the runtime environment
  var return_to = getQueryParam('return_to', 'pebblejs://close#');
  document.location = return_to + encodeURIComponent(JSON.stringify(getConfigData()));
});

(function() {
  var reminderIntervalUnit = document.getElementById('reminderIntervalUnitSelector');
  var reminderInterval = document.getElementById('reminderInterval');
  var vibrationToggle = document.getElementById("vibration");
  var lightToggle = document.getElementById("light");
  var locationToggle = document.getElementById("location");
  var reminderModeSelector = document.getElementById(localStorage['reminderMode']);

  // Load any previously saved configuration, if available
  if(localStorage['reminderMode']) {
    reminderInterval.value = JSON.parse(localStorage['reminderInterval']);
    vibrationToggle.checked = JSON.parse(localStorage['vibration']);
    lightToggle.checked = JSON.parse(localStorage['light']);
    locationToggle.checked = JSON.parse(localStorage['location']);
    reminderIntervalUnit.value = JSON.parse(localStorage['reminderIntervalUnit']);
    reminderModeSelector.className += " active";
    setSection(reminderModeSelector.id);
  }
})();
