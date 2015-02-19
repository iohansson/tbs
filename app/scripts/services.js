/*global angular*/
(function () {
  'use strict';
  
  function customBase64Encode(inputStr) {
    var bbLen = 3,
      enCharLen = 4,
      inpLen = inputStr.length,
      inx = 0,
      jnx,
      keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
               + "0123456789+/=",
      output = "",
      paddingBytes = 0,
      bytebuffer = new Array(bbLen),
      encodedCharIndexes = new Array(enCharLen);
    
    while (inx < inpLen) {
      for (jnx = 0; jnx < bbLen; ++jnx) {
        if (inx < inpLen) {
          bytebuffer[jnx] = inputStr.charCodeAt(inx++) & 0xff;
        } else {
          bytebuffer[jnx] = 0;
        }
      }
      
      encodedCharIndexes[0] = bytebuffer[0] >> 2;
      encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
      encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2)  |  (bytebuffer[2] >> 6);
      encodedCharIndexes[3] = bytebuffer[2] & 0x3f;
      
      paddingBytes = inx - (inpLen - 1);
      switch (paddingBytes) {
        case 1: 
          encodedCharIndexes[3] = 64;
          break;
        case 2:
          encodedCharIndexes[3] = 64;
          encodedCharIndexes[2] = 64;
          break;
        default:
          break;
      }
      for (jnx = 0; jnx < enCharLen; ++jnx) {
        output += keyStr.charAt(encodedCharIndexes[jnx]);
      }
    }
    
    return output;
  }
  
  angular.module('services', [])
    .factory('Preloader', ['$q', function ($q) {
      function Source(source) {
        this.source = source;
        this.deferred = $q.defer();
      }
      
      Source.prototype = {
        constructor: Source,
        load: function () {
          this.xhr = new XMLHttpRequest();
          this.xhr.addEventListener('progress', this.progress.bind(this));
          this.xhr.addEventListener('load', this.complete.bind(this));
          this.xhr.open("GET", source, true);
          this.xhr.send(null);
          
          return this.deferred.promise;
        },
        progress: function (progressEvent) {
          this.deferred.notify({
            progress: progressEvent.loaded / progressEvent.total * 100
          });
        },
        complete: function () {
          this.deferred.resolve(customBase64Encode(this.xhr.responseText));
        }
      };
      
      function Preloader(numSources) {
        this.numSources = numSources;
        this.deferred = $q.defer();
      }

      Preloader.prototype = {
        constructor: Preloader,

        loadSource: function (url) {
          var source = new Source(url),
            sourcePromise = source.load();
          this.sources.push(source);
          
          return sourcePromise;
        }
      };
      
      return Preloader;
    }]);
}());