
angular.module('simApp')
    .factory('Simulate', [ 'Upload', function (Upload) {

      var uploaded = 0,
          result;

      var listeners = [];

      return {
        upload: function (file) {
          if (!file) return;

          Upload.upload({
            url: 'upload',
            file: file

          }).progress(function (e) {
            uploaded = parseInt(100.0 * e.loaded / e.total);

          }).success(function (data) {
            result = data;
            listeners.forEach(function (callback) {
              callback(data);
            });
          });
        },
        getProgress: function () {
          return uploaded;
        },
        success: function (callback) {
          listeners.push(callback);
        }
      };

    }])

    .factory('CSVParse', function () {

      var listeners = [],
          progress = 0;

      var config = {
        delimiter: '',
        newline: '',
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (res) {
          data = res.data;
          headers = res.meta.fields;
          progress = 100;
          listeners.forEach(function (callback) {
            callback(data, headers);
          });
        },
        error: function (err) {
          console.error(err);
        }
      };

      var data, headers;

      return {
        parse: function (file) {
          Papa.parse(file, config);
        },
        success: function (callback) {
          listeners.push(callback);
        },
        getData: function () {
          return data;
        },
        getProgress: function () {
          return progress;
        }
      };
    })
    .factory('HighChart', [ function () {

      return {
        mkchart: function (type, title, series) {

          var chart = {};
          chart.config = {
            options: {
              chart: {
                type: type,
                zoomType: 'xy'
              },
              title: {
                text: title
              }
            },
            series: series
          };

          return chart;
        }
      };
    }]);