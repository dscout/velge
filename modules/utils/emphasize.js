module.exports = function(string, pattern) {
  var regex = new RegExp('(' + pattern + ')', 'i');

  return string.replace(regex, "<b>$1</b>");
};
