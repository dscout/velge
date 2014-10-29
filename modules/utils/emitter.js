module.exports = {
  on: function(name, callback, context) {
    this._events = (this._events || {});
    var events = this._events[name] || (this._events[name] = []);

    events.push({ callback: callback, context: context || this });

    return this;
  },

  off: function(name, callback, context) {
    var events = this._events[name];

    if (!callback && !context) {
      delete this._events[name];
    }

    this._events[name] = events.filter(function(event) {
      return callback && callback !== event.callback ||
             context  && context  !== event.context;
    });

    return this;
  },

  emit: function(name) {
    if (!this._events) return this;

    var args   = [].slice.call(arguments, 1);
    var events = this._events[name];

    if (events) {
      events.forEach(function(event) {
        event.callback.apply(event.context, args);
      });
    }

    return this;
  }
};
