// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  var result = [];

  function traverse(element) {
    if (element.classList && element.classList.contains(className)) result.push(element);
    var children = Array.prototype.slice.call(element.childNodes);
    children.forEach(function(item) {
      traverse(item);
    });
  };

  var body = document.body;
  traverse(body);

  return result;
}
