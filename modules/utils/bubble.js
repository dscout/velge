module.exports = {
  bubble: function(emitter, event) {
    emitter.on(event, this.emit.bind(this, event));
  }
}
