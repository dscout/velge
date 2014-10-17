module.exports = function(element) {
  var child = element.firstChild;

  while (child) {
    element.removeChild(child);
    child = element.firstChild;
  }
};
