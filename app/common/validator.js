'use strict';

var validator = {
  string: function string(string, min_len=0, max_len=50, no_empty=true){
    return new Promise(
      (resolve, reject) => {
        console.log("Testing string");
        let strLen = string.length;
        if (no_empty && (strLen == ''))
          return reject(Error('Is empty'));
        if (strLen > max_len)
          return reject(Error('Exceeds ' + max_len + ' characters'));
        if (strLen < min_len)
          return reject(Error('Minimum size is ' + min_len + ' characters'));
        return resolve(string);
      }
    );
  },
  // Check if parameter imageUrl is a url containing a valid image
  imageUrl: function imageUrl(url, timeout=5000) {
    return new Promise(
      (resolve, reject) => {
        var timer, img = new Image();
        img.onerror = img.onabort = function() {
          clearTimeout(timer);
      	  reject(Error('Image did not load succesfully'));
        };
        img.onload = function() {
           clearTimeout(timer);
           resolve(url);
        };
        timer = setTimeout(function() {
          // reset .src to invalid URL so it stops previous
          // loading, but doens't trigger new load
          img.src = "//!!!!/noexist.jpg";
          reject(Error('Image load timed out'));
        }, timeout);
        img.src = url;
      }
    );
  }

}
