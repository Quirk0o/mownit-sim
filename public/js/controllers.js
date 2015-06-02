
angular.module('simApp')

    .controller('InputController', [ '$scope', 'CSVParse', function ($scope, CSVParse) {

      this.getProgress = CSVParse.getProgress;

      var self = this;
      $scope.$watch(angular.bind(this, function () {
        return this.files;
      }), function(value) {
        self.simulate(value);
      });

      this.simulate = function (files) {
        if (!files || !files.length) return;
        var file = files[0];

        CSVParse.parse(file);
      };
    }])

    .controller('ChartController', [ '$scope', 'CSVParse', 'HighChart',
      function ($scope, CSVParse, HighChart) {

      this.charts = [];
      this.output = [];

      var self = this;
      CSVParse.success(function (data, headers) {

        output = headers.filter(function (header, index) {
          return header.includes('net_');
        });
        var netdif = headers.filter(function (header, index) {
          return header.includes('netdif_');
        });
        var input = headers.diff(output).diff(netdif);


        var config = {
          series: []
        };

        netdif.forEach(function (header) {
          var series = {
            data: [],
            name: header
          };
          data.forEach(function (row) {
            series.data.push(row[header]);
          });

          config.series.push(series);
        });

        self.charts.push(HighChart.mkchart('column', 'Błędy względne', config.series));

        input.forEach(function (header) {
          var chart = HighChart.mkchart('scatter', header, []);

          var show = true;
          if (output.indexOf('net_' + header) >= 0) {
            var series = {
              data: [],
              name: 'net_' + header,
              visible: show,
            };

            var guide = {
              data: [],
              name: 'y = x',
              lineWidth: 1
            };

            data.forEach(function (row) {
              if (!isNaN(row[header])) {
                series.data.push([row[header], row[series.name]]);
                guide.data.push([row[header], row[header]]);
              }
            });

            chart.config.series.push(series);
            chart.config.series.push(guide);
          }
          else {
            output.forEach(function (output) {
              var series = {
                data: [],
                name: output,
                visible: show
              };
              show = false;

              data.forEach(function (row) {
                if (!isNaN(row[header]))
                  series.data.push([row[header], row[output]]);
              });

              chart.config.series.push(series);
            });
          }

          self.charts.push(chart);
        });
      });
    }]);