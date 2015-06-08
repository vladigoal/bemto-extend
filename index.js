'use strict';

var through = require('through2'),
    fs = require('fs');

module.exports = function() {
  var doReplace = function(file, enc, callback) {
    var jadeVars = '';
    var dataDir = __dirname.split('node_modules')[0] + 'src/templates/data';
    
    if (file.isNull()){
      return callback(null, file);
    }

    function rFile(filesList, num){ //read file data
      if(num < filesList.length - 1){
        fs.readFile(dataDir + '/' + filesList[num], 'utf8', function (err, data) {
          // if (err) throw err;
          data = data.replace(/\r?\n|\r/g, '');
          jadeVars += '- ' + filesList[num].split('.')[0] + ' = ' + data + '\n';
          rFile(filesList, num  + 1);
        });
      }else{
        // var str = '- footerMenu = [{"title": "Сервис", "partners": true, "children": [{"title": "О нас", "url": "/about.html"}, {"title": "О рейтинге", "url": "/about-rating.html" }, { "title": "Новости", "url": "/articles.html" }, { "title": "Правила сервиса", "url": "/rules.html" } ] }]'
        file.contents = new Buffer(jadeVars + '\n' + file.contents);
        return callback(null, file);
      }
    }

    function rDir(err, filesList){ //read data dir
      rFile(filesList, 0)
    }

    function doReplace() {

      if (file.isBuffer()) {
          var result = '';
        return fs.readdir(dataDir, rDir)
      }

      callback(null, file);
    }

    doReplace();
  };

  return through.obj(doReplace);
};
