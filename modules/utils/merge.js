module.exports = function(object) {
  [].slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      object[prop] = source[prop];
    }
  });

  return object;
};
