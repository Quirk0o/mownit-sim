
angular.module('simApp', [ 'ngFileUpload', 'highcharts-ng' ]);

Array.prototype.diff = function(a) {
  return this.filter(function (i) { return a.indexOf(i) < 0; });
};