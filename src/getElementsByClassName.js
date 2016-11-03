// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className, element, results) {
    element = element || document.body;
    results = results || [];

    if (element.classList && element.classList.contains(className)) {
        results.push(element);
    }

    element.childNodes.forEach(function(child) {
        getElementsByClassName(className, child, results);
    });

    return results;
};