(function() {
  window.Velge = (function() {
    function Velge($container, options) {
      this.options = options != null ? options : {};
      this.store = new Velge.Store();
      this.ui = new Velge.UI($container, this, this.store, this.options);
      this.addCallbacks = [];
      this.remCallbacks = [];
      this._preloadChoices(this.options.chosen || [], true);
      this._preloadChoices(this.options.choices || [], false);
    }

    Velge.prototype.setup = function() {
      this.ui.setup();
      return this;
    };

    Velge.prototype.setOptions = function(newOptions) {
      var key, value, _results;
      _results = [];
      for (key in newOptions) {
        value = newOptions[key];
        _results.push(this.options[key] = value);
      }
      return _results;
    };

    Velge.prototype.addChoice = function(choice) {
      this.store.push(choice);
      this.ui.renderChoices();
      return this;
    };

    Velge.prototype.remChoice = function(choice) {
      this.store["delete"](choice);
      this.ui.renderChoices();
      return this;
    };

    Velge.prototype.addChosen = function(choice) {
      var chosen;
      this._enforceSingleChoice();
      chosen = this.store.find(choice) || choice;
      chosen.chosen = true;
      this.store.push(chosen);
      this.ui.renderChosen();
      this.ui.renderChoices();
      this._applyCallbacks(chosen, this.addCallbacks);
      return this;
    };

    Velge.prototype.remChosen = function(choice) {
      this.store.update(choice, {
        chosen: false
      });
      this.ui.renderChosen();
      this.ui.renderChoices();
      this._applyCallbacks(choice, this.remCallbacks);
      return this;
    };

    Velge.prototype.getChoices = function() {
      return this.store.choices();
    };

    Velge.prototype.getChosen = function() {
      return this.store.filter({
        chosen: true
      });
    };

    Velge.prototype.onAdd = function(callback, context) {
      this.addCallbacks.push({
        callback: callback,
        context: context
      });
      return this;
    };

    Velge.prototype.onRem = function(callback, context) {
      this.remCallbacks.push({
        callback: callback,
        context: context
      });
      return this;
    };

    Velge.prototype._enforceSingleChoice = function() {
      var choice, _i, _len, _ref, _results;
      if (this.options.single != null) {
        _ref = this.store.choices();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          choice = _ref[_i];
          _results.push(this.store.update(choice, {
            chosen: false
          }));
        }
        return _results;
      }
    };

    Velge.prototype._preloadChoices = function(choices, isChosen) {
      var choice, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = choices.length; _i < _len; _i++) {
        choice = choices[_i];
        choice.chosen = isChosen;
        _results.push(this.store.push(choice));
      }
      return _results;
    };

    Velge.prototype._applyCallbacks = function(choice, callbacks) {
      var callObject, callback, context, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callObject = callbacks[_i];
        callback = callObject.callback;
        context = callObject.context || this;
        _results.push(callback.call(context, choice, this));
      }
      return _results;
    };

    return Velge;

  })();

  Velge.Util = (function() {
    function Util() {}

    Util.autoScroll = function($element, $container, padding) {
      var baseTop, cHeight, eHeight, offset, scroll;
      if (padding == null) {
        padding = 10;
      }
      eHeight = $element.height();
      cHeight = $container.height();
      offset = $element.offset().top - $container.offset().top;
      scroll = $container.scrollTop();
      baseTop = scroll + offset + padding;
      if (offset < 0) {
        return $container.scrollTop(baseTop);
      } else if (offset + (eHeight > cHeight)) {
        return $container.scrollTop(baseTop - cHeight + eHeight);
      }
    };

    return Util;

  })();

  Velge.UI = (function() {
    UI.prototype.KEYCODES = {
      BACKSPACE: 8,
      TAB: 9,
      ENTER: 13,
      ESCAPE: 27,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      COMMA: 188
    };

    UI.prototype.wrapTemplate = "<div class='velge'>\n  <ul class='velge-list'></ul>\n  <input type='text' autocomplete='off' placeholder='{{placeholder}}' class='velge-input' />\n  <span class='velge-trigger'></span>\n  <ol class='velge-dropdown'></ol>\n</div>";

    UI.prototype.chosenTemplate = "<li>\n  <span class='name'>{{name}}</span>\n  <span class='remove'>&times;</span>\n</li>";

    UI.prototype.choiceTemplate = "<li>{{name}}</li>";

    UI.prototype.defaults = {
      placeholder: 'Add Tag'
    };

    function UI($container, velge, store, options) {
      if (options == null) {
        options = {};
      }
      this.$container = $container;
      this.velge = velge;
      this.store = store;
      this.choiceIndex = -1;
      this.chosenIndex = -1;
      this.options = this._defaults(options, this.defaults);
    }

    UI.prototype.setup = function() {
      this.render();
      this.bindDomEvents();
      this.renderChoices();
      this.renderChosen();
      return this;
    };

    UI.prototype.bindDomEvents = function() {
      var keycodes, self;
      keycodes = this.KEYCODES;
      self = this;
      this.$wrapper.on('keydown.velge', '.velge-input', function(event) {
        var callback;
        callback = function() {
          self.choiceIndex = -1;
          return self.filterChoices(self.$input.val());
        };
        switch (event.which) {
          case keycodes.ESCAPE:
            self.closeDropdown();
            self.renderHighlightedChosen();
            return self.$input.val('');
          case keycodes.COMMA:
          case keycodes.ENTER:
          case keycodes.TAB:
            event.preventDefault();
            self.submit(self.$input.val());
            self.blurInput();
            return self.closeDropdown();
          case keycodes.DOWN:
            event.preventDefault();
            self.openDropdown();
            self.cycleChoice('down');
            self.renderHighlightedChoice();
            return self.autoComplete();
          case keycodes.UP:
            event.preventDefault();
            self.openDropdown();
            self.cycleChoice('up');
            self.renderHighlightedChoice();
            return self.autoComplete();
          case keycodes.LEFT:
            event.stopPropagation();
            if (self.$input.val() === '') {
              if (self.chosenIndex === -1) {
                self.chosenIndex = 0;
              }
              self.cycleChosen('up');
              return self.renderHighlightedChosen();
            }
            break;
          case keycodes.RIGHT:
            event.stopPropagation();
            if (self.$input.val() === '') {
              if (self.chosenIndex === -1) {
                self.chosenIndex = 0;
              }
              self.cycleChosen('down');
              return self.renderHighlightedChosen();
            }
            break;
          case keycodes.BACKSPACE:
            if (self.$input.val() === '') {
              if (self.chosenIndex > -1) {
                return self.removeHighlightedChosen();
              } else {
                self.chosenIndex = 0;
                self.cycleChosen('up');
                return self.renderHighlightedChosen();
              }
            } else {
              return setTimeout(callback, 10);
            }
            break;
          default:
            return setTimeout(callback, 10);
        }
      });
      this.$wrapper.on('blur.velge', '.velge-input', function(event) {
        var callback;
        clearTimeout(self.closeTimeout);
        callback = function() {
          self.closeDropdown();
          return self.blurInput();
        };
        return self.closeTimeout = setTimeout(callback, 75);
      });
      this.$wrapper.on('click.velge', function() {
        if (!self.$input.is(':focus')) {
          self.$input.focus();
        }
        return false;
      });
      this.$wrapper.on('click.velge', '.velge-list .remove', function(event) {
        var $target;
        $target = $(event.currentTarget).parent().find('.name');
        self.velge.remChosen({
          name: $target.text()
        });
        return false;
      });
      this.$wrapper.on('click.velge', '.velge-trigger', function(event) {
        clearTimeout(self.closeTimeout);
        self.toggleDropdown();
        return false;
      });
      return this.$wrapper.on('click.velge', '.velge-dropdown li', function(event) {
        var $target;
        $target = $(event.currentTarget);
        self.submit($target.text());
        self.renderChoices();
        self.renderChosen();
        self.closeDropdown();
        return false;
      });
    };

    UI.prototype.submit = function(name) {
      if (!this.store.validate(name)) {
        return false;
      }
      return this.velge.addChosen({
        name: name
      });
    };

    UI.prototype.render = function() {
      this.$wrapper = $(this._template(this.wrapTemplate, this.options));
      this.$list = $('.velge-list', this.$wrapper);
      this.$input = $('.velge-input', this.$wrapper);
      this.$dropdown = $('.velge-dropdown', this.$wrapper);
      return this.$container.append(this.$wrapper);
    };

    UI.prototype.renderChosen = function() {
      var choice, choices;
      choices = (function() {
        var _i, _len, _ref, _results;
        _ref = this.store.filter({
          chosen: true
        });
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          choice = _ref[_i];
          _results.push(this._template(this.chosenTemplate, {
            name: choice.name
          }));
        }
        return _results;
      }).call(this);
      return this.$list.html(choices);
    };

    UI.prototype.renderChoices = function(filtered, value) {
      var choice, choices;
      filtered || (filtered = this.store.filter({
        chosen: false
      }));
      choices = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = filtered.length; _i < _len; _i++) {
          choice = filtered[_i];
          _results.push(this._template(this.choiceTemplate, {
            name: this._emphasize(choice.name, value)
          }));
        }
        return _results;
      }).call(this);
      return this.$dropdown.html(choices);
    };

    UI.prototype.renderHighlightedChoice = function() {
      var $choice, index, li, selected, _i, _len, _ref, _results;
      selected = this.choiceIndex;
      _ref = this.$dropdown.find('li');
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        li = _ref[index];
        $choice = $(li);
        $choice.toggleClass('highlighted', index === selected);
        if (index === selected) {
          _results.push(Velge.Util.autoScroll($choice, this.$dropdown));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    UI.prototype.renderHighlightedChosen = function() {
      var index, li, selected, _i, _len, _ref, _results;
      selected = this.chosenIndex;
      _ref = this.$list.find('li');
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        li = _ref[index];
        _results.push($(li).toggleClass('highlighted', index === selected));
      }
      return _results;
    };

    UI.prototype.removeHighlightedChosen = function() {
      var $target;
      $target = this.$list.find('.highlighted .name');
      this.velge.remChosen({
        name: $target.text()
      });
      return this.chosenIndex = -1;
    };

    UI.prototype.cycleChoice = function(direction) {
      var length;
      length = this.$dropdown.find('li').length;
      return this.choiceIndex = this._cycle(this.choiceIndex, length, direction);
    };

    UI.prototype.cycleChosen = function(direction) {
      var length;
      length = this.$list.find('li').length;
      return this.chosenIndex = this._cycle(this.chosenIndex, length, direction);
    };

    UI.prototype.openDropdown = function() {
      if (!this.store.isEmpty()) {
        return this.$dropdown.addClass('open');
      }
    };

    UI.prototype.closeDropdown = function() {
      this.$dropdown.removeClass('open');
      this.choiceIndex = -1;
      return this.chosenIndex = -1;
    };

    UI.prototype.toggleDropdown = function() {
      if (this.$dropdown.hasClass('open')) {
        return this.closeDropdown();
      } else {
        return this.openDropdown();
      }
    };

    UI.prototype.blurInput = function() {
      return this.$input.val('');
    };

    UI.prototype.filterChoices = function(value) {
      var matching;
      matching = this.store.fuzzy(value);
      this.renderChoices(matching, value);
      return this.$dropdown.toggleClass('open', matching.length !== 0);
    };

    UI.prototype.autoComplete = function() {
      var $highlighted;
      $highlighted = this.$dropdown.find('.highlighted');
      return this.$input.val($highlighted.text());
    };

    UI.prototype._cycle = function(index, length, direction) {
      if (direction == null) {
        direction = 'down';
      }
      if (length > 0) {
        if (direction === 'down') {
          return (index + 1) % length;
        } else {
          return (index + (length - 1)) % length;
        }
      } else {
        return -1;
      }
    };

    UI.prototype._defaults = function(options, defaults) {
      var key, value;
      for (key in defaults) {
        value = defaults[key];
        if (options[key] == null) {
          options[key] = defaults[key];
        }
      }
      return options;
    };

    UI.prototype._template = function(string, object) {
      var buffer, key, value;
      buffer = string;
      for (key in object) {
        value = object[key];
        buffer = buffer.replace("{{" + key + "}}", value);
      }
      return buffer;
    };

    UI.prototype._emphasize = function(string, value) {
      if ((value != null) && value.length > 0) {
        return string.replace(new RegExp("(" + value + ")", 'i'), "<b>$1</b>");
      } else {
        return string;
      }
    };

    return UI;

  })();

  Velge.Store = (function() {
    function Store() {
      this.arr = [];
      this.map = {};
    }

    Store.prototype.choices = function() {
      return this.arr;
    };

    Store.prototype.isEmpty = function() {
      return this.arr.length === 0;
    };

    Store.prototype.normalize = function(value) {
      return String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '');
    };

    Store.prototype.sanitize = function(value) {
      return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    };

    Store.prototype.validate = function(value) {
      return !/^\s*$/.test(value);
    };

    Store.prototype.push = function(choice) {
      choice.name = this.normalize(choice.name);
      choice.chosen || (choice.chosen = false);
      if (this.find(choice) == null) {
        this.arr.push(choice);
        this.map[choice.name] = choice;
      }
      this.sort();
      return this;
    };

    Store.prototype["delete"] = function(toRemove) {
      var choice, index, _i, _len, _ref;
      _ref = this.arr;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        choice = _ref[index];
        if (choice.name === toRemove.name) {
          this.arr.splice(index, 1);
          break;
        }
      }
      delete this.map[toRemove.name];
      return this;
    };

    Store.prototype.update = function(toUpdate, values) {
      var choice, key, value, _results;
      choice = this.find(toUpdate);
      _results = [];
      for (key in values) {
        value = values[key];
        _results.push(choice[key] = value);
      }
      return _results;
    };

    Store.prototype.find = function(toFind) {
      return this.map[this.normalize(toFind.name)];
    };

    Store.prototype.fuzzy = function(value) {
      var choice, query, regex, _i, _len, _ref, _results;
      value = this.sanitize(value);
      query = /^\s*$/.test(value) ? '.*' : value;
      regex = RegExp(query, 'i');
      _ref = this.arr;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        if (!choice.chosen && regex.test(choice.name)) {
          _results.push(choice);
        }
      }
      return _results;
    };

    Store.prototype.filter = function(options) {
      var choice, _i, _len, _ref, _results;
      if (options == null) {
        options = {};
      }
      options.chosen || (options.chosen = false);
      _ref = this.arr;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        if (choice.chosen === options.chosen) {
          _results.push(choice);
        }
      }
      return _results;
    };

    Store.prototype.sort = function() {
      this.arr = this.arr.sort(function(a, b) {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      return this.arr;
    };

    return Store;

  })();

}).call(this);
