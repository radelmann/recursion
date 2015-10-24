// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
  var types = {
    'string': function() {
      return '"' + obj + '"';
    },
    'function': function() {
      return '{}';
    },
    'undefined': function() {
      return '{}';
    },
    'object': function() {
      if (obj) {
        if (Array.isArray(obj)) {
          var vals = [];
          for (var i = 0; i < obj.length; i++) {
            vals.push(stringifyJSON(obj[i]));
          };
          return '[' + vals.join(',') + ']';
        } else {
          var vals = [];
          for (var key in obj) {
            //need to skip function and undefined
            if (typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined')
              vals.push(stringifyJSON(key) + ":" + stringifyJSON(obj[key]));
          }
          return '{' + vals.join(',') + '}';
        }
      } else {
        return 'null';
      }
    }
  };

  var type = typeof obj;
  if (typeof types[type] === 'function') {
    return types[type]();
  } else {
    return obj.toString();
  }
};
