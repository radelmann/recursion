// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
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
      error("Expected '" + c + "' instead of '" + chr + "'");
    }
    getNext();
  };

  //skip white space
  var white = function() {
    while (chr && chr === ' ') {
      getNext();
    }
  };

  //throw error
  var error = function(msg) {
    throw {
      name: 'SyntaxError',
      message: msg,
      at: i,
      text: json
    };
  };

  var string = function() {
    var str = '';
    while (chr) {
      getNext();
      if (chr === '"') {
        getNext();
        return str;
      }
      //todo - escape chars
      str += chr;
    }
    error('Invalid String');
  };

  var word = function() {
    //true,false,null
    switch (chr) {
      case 't':
        expect('t');
        expect('r');
        expect('u');
        expect('e');
        return true;
      case 'f':
        expect('f');
        expect('a');
        expect('l');
        expect('s');
        expect('e');
        return false;
      case 'n':
        expect('n');
        expect('u');
        expect('l');
        expect('l');
        return null;
    }
    error("Unexpected '" + chr + "'");
  };

  var number = function() {
    var num, str = '';

    if (chr === '-') {
      str = '-';
      getNext();
    }
    while (chr >= '0' && chr <= '9') {
      str += chr;
      getNext();
    }
    if (chr === '.') {
      str += '.';
      getNext();
      while (chr >= '0' && chr <= '9') {
        str += chr;
        getNext();
      }
    }
    num = +str;
    return num;
  };

  var array = function() {
    var arr = [];

    white();
    getNext();
    if (chr === ']') {
      return arr;
    }

    while (chr) {
      arr.push(parseValue());
      white();
      if (chr === ']') return arr;
      expect(',');
      white();
    }
    error('error parsing array!');
  };

  var object = function() {
    var key;
    var obj = {};

    white();
    getNext();

    if (chr === '}') {
      return obj;
    }

    while (chr) {
      //parse key
      if (chr === '"') {
        key = string();
      } else {
        throw ('invalid object key');
      }
      white();
      expect(':');
      white();
      //parse value
      obj[key] = parseValue();
      white();
      if (chr === '}') return obj;
      expect(',');
      white();
    }
    error('invalid object!');
  };

  var parseValue = function() {
    white();
    if (chr === '{') {
      return object();
    } else if (chr === '[') {
      return array();
    } else if (chr === '"') {
      return string();
    } else if (chr === '-') {
      return number();
    } else {
      return chr >= '0' && chr <= '9' ? number() : word();
    }
  }
  return parseValue();
}
