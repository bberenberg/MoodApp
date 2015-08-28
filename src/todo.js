/*
Future planned use for affirmations.

main.on('longClick', 'down', function(e) {
  var affirmation = new UI.Card({});
  affirmation = buildAffirmation(affirmation);
  affirmation.on('back', function(e) {
    main.body(mainContent());
  });
  affirmation.show();
});

This will be used to build the affirmation card in the future.

function buildAffirmation(affirmation){
  affirmation.body('test');
  return affirmation;
} */

// use this to add action icons: http://developer.getpebble.com/docs/pebblejs/#window-action-actiondef

// Do I need to be cleaning up my windows? http://developer.getpebble.com/docs/pebblejs/#window-hide

// Config page: https://github.com/pebble/slate

// reminders

// Pebble.showSimpleNotificationOnPebble(title, text);

// https://www.reddit.com/r/pebble/
// Notification settings: http://i.imgur.com/P8kHHnO.png

  //localStorage.setItem('moodapp_' + Pebble.getAccountToken() + '_timer', );
//setTimeout(function(){ clearInterval(timer); console.log('cleared'); }, 30000);

      //console.log('Pebble Account Token: ' + Pebble.getAccountToken());
     // console.log('Pebble Watch Token: ' + Pebble.getWatchToken());

//loggers
/*
functions.logFunction = function(logger, levels, level) {
  return function() {
    var args = Array.prototype.splice.call(arguments, 0);
    if (levels.indexOf(level) <= levels.indexOf(logger.level)) {
      console.log.apply(console, args);
    }
  };
};

functions.Logger = function() {
  if (!(this instanceof functions.Logger)) {
    return new functions.Logger();
  }
  var levels = ['always', 'error', 'warn', 'info', 'debug'];
  for (var i = 0; i < levels.length; i++) {
    this[levels[i]] = functions.logFunction(this, levels, levels[i]);
  }
  this.level = 'debug';
  return this;
};
*/