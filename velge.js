(function() {
  window.Velge = (function() {
    function Velge($container, options) {
      if (options == null) {
        options = {};
      }
      this.store = new Velge.Store();
      this.ui = new Velge.UI($container, this, this.store);
      this._preloadChoices(options.chosen || [], true);
      this._preloadChoices(options.choices || [], false);
    }

    Velge.prototype.setup = function() {
      this.ui.setup();
      return this;
    };

    Velge.prototype.addChosen = function(choice) {
      this.store.push(choice, true);
      this.ui.renderChosen();
      return this;
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

    Velge.prototype.remChosen = function(choice) {
      this.store.update(choice, {
        chosen: false
      });
      this.ui.renderChosen();
      this.ui.renderChoices();
      return this;
    };

    Velge.prototype._preloadChoices = function(choices, isChosen) {
      var choice, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = choices.length; _i < _len; _i++) {
        choice = choices[_i];
        _results.push(this.store.push(choice, isChosen));
      }
      return _results;
    };

    return Velge;

  })();

  Velge.UI = (function() {
    UI.prototype.KEYCODES = {
      TAB: 9,
      ENTER: 13,
      ESCAPE: 27,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      COMMA: 188
    };

    UI.prototype.wrapTemplate = "<div class='velge'>\n  <ul class='velge-list'></ul>\n  <input type='text' autocomplete='off' placeholder='Add Tags' class='velge-input placeholder' />\n  <span class='velge-trigger'></span>\n  <ol class='velge-dropdown'></ol>\n</div>";

    UI.prototype.chosenTemplate = "<li>\n  <span class='name'>{{name}}</span>\n  <span class='remove'>&times;</span>\n</li>";

    UI.prototype.choiceTemplate = "<li>{{name}}</li>";

    function UI($container, velge, store) {
      this.$container = $container;
      this.velge = velge;
      this.store = store;
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
        switch (event.which) {
          case keycodes.ESCAPE:
            self.closeDropdown();
            return self.$input.val('');
          case keycodes.DOWN:
            self.openDropdown();
            self.store.cycle('down');
            return self.renderHighlighted();
          case keycodes.UP:
            self.openDropdown();
            self.store.cycle('up');
            return self.renderHighlighted();
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
      this.$wrapper.on('click.velge', '.velge-trigger', function(event) {
        return self.openDropdown();
      });
      return this.$wrapper.on('click.velge', '.velge-dropdown li', function(event) {
        var $target;
        $target = $(event.currentTarget);
        self.choose($target.text());
        self.renderChoices();
        self.renderChosen();
        return self.closeDropdown();
      });
    };

    UI.prototype.choose = function(name) {
      return this.store.update({
        name: name
      }, {
        chosen: true
      });
    };

    UI.prototype.render = function() {
      this.$wrapper = $(this.wrapTemplate);
      this.$list = $('.velge-list', this.$wrapper);
      this.$input = $('.velge-input', this.$wrapper);
      this.$dropdown = $('.velge-dropdown', this.$wrapper);
      return this.$container.append(this.$wrapper);
    };

    UI.prototype.renderChosen = function() {
      var choice, choices;
      choices = (function() {
        var _i, _len, _ref, _results;
        _ref = this.store.filter(true);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          choice = _ref[_i];
          _results.push(this.chosenTemplate.replace('{{name}}', choice.name));
        }
        return _results;
      }).call(this);
      return this.$list.empty().html(choices);
    };

    UI.prototype.renderChoices = function() {
      var choice, choices;
      choices = (function() {
        var _i, _len, _ref, _results;
        _ref = this.store.filter(false);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          choice = _ref[_i];
          _results.push(this.choiceTemplate.replace('{{name}}', choice.name));
        }
        return _results;
      }).call(this);
      return this.$dropdown.empty().html(choices);
    };

    UI.prototype.renderHighlighted = function() {
      var index, li, selected, _i, _len, _ref, _results;
      selected = this.store.index;
      _ref = this.$dropdown.find('li');
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        li = _ref[index];
        _results.push($(li).toggleClass('highlighted', index === selected));
      }
      return _results;
    };

    UI.prototype.openDropdown = function() {
      if (!this.store.isEmpty()) {
        return this.$dropdown.addClass('open');
      }
    };

    UI.prototype.closeDropdown = function() {
      return this.$dropdown.removeClass('open');
    };

    UI.prototype.blurInput = function() {
      return this.$input.blur();
    };

    return UI;

  })();

  Velge.Store = (function() {
    function Store() {
      this.arr = [];
      this.map = {};
      this.index = -1;
    }

    Store.prototype.objects = function() {
      return this.arr;
    };

    Store.prototype.normalize = function(value) {
      return String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '');
    };

    Store.prototype.push = function(choice, isChosen) {
      if (isChosen == null) {
        isChosen = false;
      }
      choice.chosen = isChosen;
      choice.name = this.normalize(choice.name);
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

    Store.prototype.length = function(withChosen) {
      if (withChosen == null) {
        withChosen = false;
      }
      if (withChosen) {
        return this.arr.length;
      } else {
        return this.filter(withChosen).length;
      }
    };

    Store.prototype.cycle = function(direction) {
      var length;
      if (direction == null) {
        direction = 'down';
      }
      length = this.length();
      return this.index = direction === 'down' ? (this.index + 1) % length : (this.index + (length - 1)) % length;
    };

    Store.prototype.selected = function() {
      return this.filter(false)[this.index];
    };

    Store.prototype.filter = function(isChosen) {
      var choice, _i, _len, _ref, _results;
      _ref = this.arr;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        if (choice.chosen === isChosen) {
          _results.push(choice);
        }
      }
      return _results;
    };

    Store.prototype.find = function(toFind) {
      return this.map[toFind.name];
    };

    Store.prototype.isEmpty = function() {
      return this.arr.length === 0;
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
