// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
  var string = function(val) {
    return '"' + val + '"';
  };

  var types = {
    'string': function() {
      return string(obj);
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
          obj.forEach(function(item) {
            vals.push(stringifyJSON(item));
          });
          return '[' + vals.join(',') + ']';
        } else {
          var vals = [];
          for (var key in obj) {
            //need to skip function and undefined
            if (typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined')
              vals.push(string(key) + ":" + stringifyJSON(obj[key]));
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
