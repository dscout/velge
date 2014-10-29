module.exports = function(index, length, direction) {
  if (length < 1) return -1;

  if (direction === 'up' && index === -1) index = 0;

  if (direction === 'down') {
    return (index + 1) % length;
  } else {
    return (index + (length - 1)) % length;
  }
};
