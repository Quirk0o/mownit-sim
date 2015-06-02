var express = require('express'),
    multer = require('multer'),
    router = express.Router(),
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path'),
    rio = require('rio');

router.post('/', [ multer({ dest: 'uploads' }), function(req, res, next) {

  var file = req.files.file;

  rio.sourceAndEval('app/sim.R', {
    data: 'uploads/' + file.name,
    entryPoint: 'simulate',
    callback: function (err, result) {
      if (err) {
        return console.error(err);
      }

      fs.unlink(file.path, function (e) {
        if (e)
          console.error(e);
      });

      res.send(result);
    }
  });
  /*exec(cmd, function (err, stdout, stderr) {
    if (err !== null) {
      console.log(err);
    }

    fs.unlink(file.path, function (e) {
      if (e)
        console.error(e);
    });
  });*/

}]);

module.exports = router;