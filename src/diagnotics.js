var UI = require('ui');
var diagnostics = module.exports;
var functions = require('functions');

diagnostics.printVotes =function(array){
  functions.myLogger.debug('print the votes');
  for (var i = 0; i < array.length; i++){
    console.log(array[i][0] + '  ' + array[i][1]);
  }
};

diagnostics.test = function(){
  console.log('test');
};