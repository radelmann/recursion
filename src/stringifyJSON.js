// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
    if (typeof obj === "string") {
        return '"' + obj + '"';
    }

    if (obj === null) {
        return "null";
    }

    if ((typeof obj === 'undefined') || (typeof obj === 'function')) {
        return;
    }

    if (Array.isArray(obj)) {
        var ret = '';
        for (var i = 0; i < obj.length; i++) {
            ret += stringifyJSON(obj[i]);
            ret += i === obj.length - 1 ? '' : ',';
        }
        return '[' + ret + ']';
    }

    if (obj && typeof obj === 'object') {
        var ret = '';
        var length = Object.keys(obj).length;
        var count = 0;
        for (var key in obj) {
            if (typeof stringifyJSON(obj[key]) !== 'undefined') {
                count++;
                ret += stringifyJSON(key);
                ret += ':';
                ret += stringifyJSON(obj[key]);
                ret += count === length ? '' : ',';
            }
        }
        return '{' + ret + '}';
    }

    return "" + obj;
};
