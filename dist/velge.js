(function() {
  window.Velge = (function() {
    var Store;

    Store = (function() {
      function Store() {
        this.arr = [];
        this.map = {};
      }

      Store.prototype.objects = function() {
        return this.arr;
      };

      Store.prototype.push = function(choice, isChosen) {
        if (isChosen == null) {
          isChosen = false;
        }
        choice.chosen = isChosen;
        if (this.find(choice) == null) {
          this.arr.push(choice);
          this.map[choice.name] = choice;
        }
        return this.sort();
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
        return delete this.map[toRemove.name];
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
        return this.map[toFind.name];
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

    Velge.prototype.wrapTemplate = "<div class='velge'>\n  <ul class='velge-list'></ul>\n  <input type='text' autocomplete='off' placeholder='Add Tags' class='velge-input placeholder' />\n  <span class='velge-trigger'></span>\n  <ol class='velge-dropdown'></ol>\n</div>";

    Velge.prototype.chosenTemplate = "<li>\n  <b>{{name}}</b>\n  <i>&times;</i>\n</li>";

    Velge.prototype.choiceTemplate = "<li>{{name}}</li>";

    function Velge($container, options) {
      if (options == null) {
        options = {};
      }
      this.$container = $container;
      this.store = new Store();
      this._preloadChoices(options.chosen || [], true);
      this._preloadChoices(options.choices || [], false);
    }

    Velge.prototype.setup = function() {
      this.inject();
      this._renderChoices();
      this._renderChosen();
      return this;
    };

    Velge.prototype.inject = function() {
      this.$wrapper = $(this.wrapTemplate);
      this.$list = $('.velge-list', this.$wrapper);
      this.$dropdown = $('.velge-dropdown', this.$wrapper);
      this.$container.append(this.$wrapper);
      return this;
    };

    Velge.prototype.addChosen = function(choice) {
      this.store.push(choice, true);
      this._renderChosen();
      return this;
    };

    Velge.prototype.addChoice = function(choice) {
      this.store.push(choice);
      this._renderChoices();
      return this;
    };

    Velge.prototype.remChoice = function(choice) {
      this.store["delete"](choice);
      this._renderChoices();
      return this;
    };

    Velge.prototype.remChosen = function(choice) {
      this.store.update(choice, {
        chosen: false
      });
      this._renderChosen();
      this._renderChoices();
      return this;
    };

    Velge.prototype._renderChosen = function() {
      var choice, choices;
      choices = (function() {
        var _i, _len, _ref, _results;
        _ref = this.store.objects();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          choice = _ref[_i];
          if (choice.chosen) {
            _results.push(this.chosenTemplate.replace('{{name}}', choice.name));
          }
        }
        return _results;
      }).call(this);
      return this.$list.empty().html(choices);
    };

    Velge.prototype._renderChoices = function() {
      var choice, choices;
      choices = (function() {
        var _i, _len, _ref, _results;
        _ref = this.store.objects();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          choice = _ref[_i];
          if (!choice.chosen) {
            _results.push(this.choiceTemplate.replace('{{name}}', choice.name));
          }
        }
        return _results;
      }).call(this);
      return this.$dropdown.empty().html(choices);
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

}).call(this);
