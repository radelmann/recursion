// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
  if (Array.isArray(obj)) {
    var vals = [];
    obj.forEach(function(item) {
      vals.push(stringifyJSON(item));
    });
    return '[' + vals.join(',') + ']';
  }

  if (obj && typeof obj === 'object') {
    var vals = [];
    for (var key in obj) {
      if (typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined') {
        vals.push(stringifyJSON(key) + ":" + stringifyJSON(obj[key]));
      }
    }
    return '{' + vals.join(',') + '}';
  }

  if (typeof obj === 'string') {
    return '"' + obj + '"';
  }

  //catch all - handles number, boolean, null 
  return '' + obj;
};
