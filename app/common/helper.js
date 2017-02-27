'use strict';

var helper = {
  shake: function shake(div, interval=100, distance=10, times=4) {
    $(div).css('position','relative');

    for(let iter=0;iter<(times+1);iter++){
        $(div).animate({
            left:((iter%2==0 ? distance : distance*-1))
            },interval);
    }

    $(div).animate({ left: 0},interval);
  },
  findAncestorByClass: function findAncestor (element, elementClass) {
    while (
      (element = element.parentElement) &&
      !element.classList.contains(elementClass)
    );
    return element;
  },
  capitalizeFirstLetter: function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  // Check if parameter imageUrl is a url containing a valid image
  testImage: function testImage(url, timeout=5000) {
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
  },
  validateString: function validateString(string, min_len=0, max_len=50, no_empty=true){
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
  }

}
