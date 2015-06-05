'use strict';

var through = require('through2');
var rs = require('replacestream');
var istextorbinary = require('istextorbinary');

module.exports = function() {
  var doReplace = function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    function doReplace() {

      console.log('lo')
      if (file.isBuffer()) {
          var chunks = String(file.contents).split(': +i');
          var result;

          
          // console.log('chunks=', chunks.length)
          // result = chunks.join('\n' + blockSpaces + '    +te(' + blockName + ')');


        console.log('chunks=', chunks)
        console.log('============')

        for (var i = 0; i < chunks.length; i++){
            if(i < chunks.length - 1){
                var block = chunks[i].split('\n')[chunks[i].split('\n').length - 1]
                var blockSpaces = block.split('+b')[i]
                var blockName = block.split('.')[1]
                console.log('chunks if=', chunks[i] + '\n' + blockSpaces + '    +te(' + blockName + ')')
                result += chunks[i] + '\n' + blockSpaces + '    +te(' + blockName + ')';
            }else{
                console.log('chunk else ============')
                result += chunks[i];
            }
            // result += chunks[i] + '\n' + blockSpaces + '    +te(' + blockName + ')';
          // result.push(replacement(search));
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
