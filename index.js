//from gulp-replace 
'use strict';

var through = require('through2'),
    fs = require('fs');

module.exports = function() {
  var doReplace = function(file, enc, callback) {
    var firstFile = true;
    if (file.isNull()) {
      return callback(null, file);
    }

    function doReplace() {


      function mixin(blockName){
        return  '  mixin dinamicMixin(data1, data2, data3)\n' +
                blockSpaces + '    - data = {}\n' +
                blockSpaces + '    - redefines = []\n' +
                blockSpaces + '    - if (typeof data1 === "object") redefines.push(data1)\n' +
                // blockSpaces + '    - da = JSON.stringify(data1)\n' +
                // blockSpaces + '    p #{da}\n' +
                blockSpaces + '    - for (var i in redefines)\n' +
                blockSpaces + '      - for (var k in redefines[i])\n' +
                blockSpaces + '        - if (redefines[i].hasOwnProperty(k))\n' +
                blockSpaces + '          - data[k] = redefines[i][k]\n' +
                blockSpaces + '    - data._bemto_chain = bemto_chain.slice()\n' +
                blockSpaces + '    - blockName = bemto_chain[bemto_chain.length-1]\n' +
                blockSpaces + '    include ../../templates/blocks/' + blockName + '/' + blockName + '.jade\n' +
                blockSpaces + '  +dinamicMixin'
      }

      function parsseParentTpl(){
        var tpl = chunks[0].split(/\n/g)[0].split(/extends\s{1,}/g)
        if(tpl.length >  1){
          tpl = tpl[1].split(/[..]/g)[2]
          var filePath = __dirname.split('node_modules')[0] + 'src/templates' + tpl + '.jade';
          firstFile = false;
          fs.readFile(filePath, 'utf-8', function (err, data) {
            var chunks2 = data.split(': +i');
            console.log('chunks2=', chunks2);
            // doReplace();
            for (var i = 0; i < chunks2.length; i++){
              if(i < chunks2.length - 1){
                  var block = chunks2[i].split('\n')[chunks2[i].split('\n').length - 1]
                  var blockSpaces = block.split('+b')[0]
                  var blockName = block.split('.')[1]
                  result += chunks2[i] + '\n' + blockSpaces + mixin(blockName);
              }else{
                  result += chunks2[i];
              }
            }

            var fName = tpl.split('/')[tpl.split('/').length - 1];
            var fileOutPath = __dirname.split('node_modules')[0] + 'dev/' + fName + '.jade';
            fs.writeFile(fileOutPath, result, function (err) {
            //   parsseParentTpl();
            //   console.log('It\'s saved!');
            });

          });
        }else{
          return callback(null, file);
        }
      }

      var chunks = String(file.contents).split(': +i');
      var result = '';

      for (var i = 0; i < chunks.length; i++){
          if(i < chunks.length - 1){
              var block = chunks[i].split('\n')[chunks[i].split('\n').length - 1]
              var blockSpaces = block.split('+b')[0]
              var blockName = block.split('.')[1]
              result += chunks[i] + '\n' + blockSpaces + mixin(blockName);
          }else{
              result += chunks[i];
          }
      }

      file.contents = new Buffer(result);

      parsseParentTpl();

      callback(null, file);
    }

    doReplace();
  };

  return through.obj(doReplace);
};
