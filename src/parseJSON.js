// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  "use strict";
  var chr = ' ';
  var i = 0;

  //get next char
  var getNext = function() {
    chr = json.charAt(i);
    i++;
    return chr;
  }

  //test that current char is expected value and then get next char
  var expect = function(c) {
    if (c && c !== chr) {
      error("expecting '" + c + "' instead of '" + chr + "'");
    }
    getNext();
  };

  var expectChars = function(str) {
    var strArray = str.split('');
    strArray.forEach(function(c) {
      expect(c);
    });
  };

  var isNum = function() {
    var reg = new RegExp('^\\d{1}$');
    return reg.test(chr);
  }

  //skip white space
  var white = function() {
    while (chr && chr <= ' ') {
      getNext();
    }
  };

  //throw error
  var error = function(msg) {
    throw new SyntaxError(msg, i, json);
  };

  var string = function() {
    //json escape char rules, src:
    //http://stackoverflow.com/questions/19176024/how-to-escape-special-characters-in-building-a-json-string
    var escapeChrs = {
      '"': '"',
      '\\': '\\', //this is really one backslash, since it needs to be escaped in js
      '/': '/',
      b: '\b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t'
    };

    var str = '';
    while (chr) {
      getNext();
      if (chr === '"') {
        getNext();
        return str;
      }
      //parse char escapes
      if (chr === '\\') { //this is really one backslash, since it needs to be escaped in js
        getNext();
        if (typeof escapeChrs[chr] === 'string') {
          str += escapeChrs[chr];
        } else {
          break;
        }
      } else {
        str += chr;
      }
    }
    error('error parsing string');
  };

  var word = function() {
    if (chr === 't') {
      expectChars('true');
      return true;
    } else if (chr === 'f') {
      expectChars('false');
      return false;
    } else if (chr === 'n') {
      expectChars('null');
      return null;
    }

    error("error parsing word, unexpected '" + chr + "'");
  };

  var number = function() {
    //need error handling here
    //test for odd cases 
    var num, str = '';

    if (chr === '-') {
      str = '-';
      getNext();
    }
    while (isNum()) {
      str += chr;
      getNext();
    }
    if (chr === '.') {
      str += '.';
      getNext();
      while (isNum()) {
        str += chr;
        getNext();
      }
    }
    num = +str;
    return num;
  };

  var array = function() {
    var arr = [];

    getNext();
    white();

    if (chr === ']') {
      getNext();
      return arr;
    }

    while (chr) {
      arr.push(parseValue());
      white();
      if (chr === ']') {
        getNext();
        return arr;
      }
      expect(',');
    }
    error('error parsing array');
  };

  var object = function() {
    var key;
    var obj = {};

    getNext();
    white();

    if (chr === '}') {
      getNext();
      return obj;
    }

    while (chr) {
      //parse object key
      if (chr === '"') {
        key = string();
      } else {
        throw ('error parsing object key');
      }
      white();
      expect(':');
      //parse object value
      obj[key] = parseValue();
      white();
      if (chr === '}') {
        getNext();
        return obj;
      }
      expect(',');
      white();
    }
    error('error parsing object');
  };

  var parseValue = function() {
    white();

    var actions = {
      '{': object,
      '[': array,
      '"': string,
      '-': number
    };

    if (typeof actions[chr] === 'function') {
      return actions[chr]();
    } else {
      return isNum() ? number() : word();
    }
  }

  return parseValue();
}
