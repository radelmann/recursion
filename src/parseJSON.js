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
      error("Expecting '" + c + "' instead of '" + chr + "'");
    }
    getNext();
  };

  //skip white space
  var white = function() {
    while (chr && chr <= ' ') {
      getNext();
    }
  };

  //throw error
  var error = function(msg) {
    throw new SyntaxError( msg, i, json);
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

    getNext();
    white();

    if (chr === ']') {
      getNext();
      return arr;
    }

    while (chr) {
      arr.push(parseValue());
      //getNext();
      white();
      if (chr === ']') {
        getNext();
        return arr;
      }
      expect(',');
    }
    error('error parsing array!');
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
      //parse key
      if (chr === '"') {
        key = string();
      } else {
        throw ('invalid object key');
      }
      //getNext();
      white();
      expect(':');
      //getNext();
      obj[key] = parseValue();
      //getNext();
      white();
      if (chr === '}') {
        getNext();
        return obj;
      }
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


var input = [
  '[]',
  '{"foo": ""}',
  '{}',
  '{"foo": "bar"}',
  '["one", "two"]',
  '{"a": "b", "c": "d"}',
  '[null,false,true]',
  '{"foo": true, "bar": false, "baz": null}',
  '[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]',
  '{"boolean, true": true, "boolean, false": false, "null": null }',
  '{"a":{"b":"c"}}',
  '{"a":["b", "c"]}',
  '[{"a":"b"}, {"c":"d"}]',
  '{"a":[],"c": {}, "b": true}',
  '[[[["foo"]]]]',
  '["\\\\\\"\\"a\\""]',
  '["and you can\'t escape thi\s"]',
  '{"CoreletAPIVersion":2,"CoreletType":"standalone",' +
  '"documentation":"A corelet that provides the capability to upload' +
  ' a folderâ€™s contents into a userâ€™s locker.","functions":[' +
  '{"documentation":"Displays a dialog box that allows user to ' +
  'select a folder on the local system.","name":' +
  '"ShowBrowseDialog","parameters":[{"documentation":"The ' +
  'callback function for results.","name":"callback","required":' +
  'true,"type":"callback"}]},{"documentation":"Uploads all mp3 files' +
  ' in the folder provided.","name":"UploadFolder","parameters":' +
  '[{"documentation":"The path to upload mp3 files from."' +
  ',"name":"path","required":true,"type":"string"},{"documentation":' +
  ' "The callback function for progress.","name":"callback",' +
  '"required":true,"type":"callback"}]},{"documentation":"Returns' +
  ' the server name to the current locker service.",' +
  '"name":"GetLockerService","parameters":[]},{"documentation":' +
  '"Changes the name of the locker service.","name":"SetLockerSer' +
  'vice","parameters":[{"documentation":"The value of the locker' +
  ' service to set active.","name":"LockerService","required":true' +
  ',"type":"string"}]},{"documentation":"Downloads locker files to' +
  ' the suggested folder.","name":"DownloadFile","parameters":[{"' +
  'documentation":"The origin path of the locker file.",' +
  '"name":"path","required":true,"type":"string"},{"documentation"' +
  ':"The Window destination path of the locker file.",' +
  '"name":"destination","required":true,"type":"integer"},{"docum' +
  'entation":"The callback function for progress.","name":' +
  '"callback","required":true,"type":"callback"}]}],' +
  '"name":"LockerUploader","version":{"major":0,' +
  '"micro":1,"minor":0},"versionString":"0.0.1"}',
  '{ "firstName": "John", "lastName" : "Smith", "age" : ' +
  '25, "address" : { "streetAddress": "21 2nd Street", ' +
  '"city" : "New York", "state" : "NY", "postalCode" : ' +
  ' "10021" }, "phoneNumber": [ { "type" : "home", ' +
  '"number": "212 555-1234" }, { "type" : "fax", ' +
  '"number": "646 555-4567" } ] }',
  '{\r\n' +
  '          "glossary": {\n' +
  '              "title": "example glossary",\n\r' +
  '      \t\t"GlossDiv": {\r\n' +
  '                  "title": "S",\r\n' +
  '      \t\t\t"GlossList": {\r\n' +
  '                      "GlossEntry": {\r\n' +
  '                          "ID": "SGML",\r\n' +
  '      \t\t\t\t\t"SortAs": "SGML",\r\n' +
  '      \t\t\t\t\t"GlossTerm": "Standard Generalized ' +
  'Markup Language",\r\n' +
  '      \t\t\t\t\t"Acronym": "SGML",\r\n' +
  '      \t\t\t\t\t"Abbrev": "ISO 8879:1986",\r\n' +
  '      \t\t\t\t\t"GlossDef": {\r\n' +
  '                              "para": "A meta-markup language,' +
  ' used to create markup languages such as DocBook.",\r\n' +
  '      \t\t\t\t\t\t"GlossSeeAlso": ["GML", "XML"]\r\n' +
  '                          },\r\n' +
  '      \t\t\t\t\t"GlossSee": "markup"\r\n' +
  '                      }\r\n' +
  '                  }\r\n' +
  '              }\r\n' +
  '          }\r\n' +
  '      }\r\n'
];

// input.forEach(function(item) {
//   console.log(parseJSON(item));
// });

// console.log(JSON.parse('["\\\\\\"\\"a\\""]'));
// console.log(JSON.parse('["and you can\'t escape thi\s"]'));

// var str = 'and you can\'t escape this!';
// console.log(str);
