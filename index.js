'use strict';

var through = require('through2');

module.exports = function() {
  var doReplace = function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    function doReplace() {

      if (file.isBuffer()) {
          var chunks = String(file.contents).split(': +i');
          var result = '';

        for (var i = 0; i < chunks.length; i++){
            if(i < chunks.length - 1){
                var block = chunks[i].split('\n')[chunks[i].split('\n').length - 1]
                var blockSpaces = block.split('+b')[0]
                var blockName = block.split('.')[1]
                result += chunks[i] + '\n' + blockSpaces + '    +i';
            }else{
                result += chunks[i];
            }
        }

          file.contents = new Buffer(result);

        return callback(null, file);
      }

      callback(null, file);
    }

    doReplace();
  };

  return through.obj(doReplace);
};
