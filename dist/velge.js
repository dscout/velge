(function() {
  window.Velge = (function() {
    Velge.prototype.wrapTemplate = "<div class='velge'>\n  <ul class='velge-list'></ul>\n  <input type='text' autocomplete='off' placeholder='Add Tags' class='velge-input placeholder' />\n  <span class='velge-trigger'></span>\n  <ol class='velge-dropdown'></ol>\n</div>";

    Velge.prototype.chosenTemplate = "<li>\n  <b>{{name}}</b>\n  <i>&times;</i>\n</li>";

    Velge.prototype.choiceTemplate = "<li>{{name}}</li>";

    function Velge($container, options) {
      if (options == null) {
        options = {};
      }
      this.$container = $container;
      this.chosen = options.chosen || [];
      this._choices = [];
      this._choiceMap = {};
    }

    Velge.prototype.setup = function() {
      var chosen, _i, _len, _ref, _results;
      this.inject();
      _ref = this.chosen;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        chosen = _ref[_i];
        _results.push(this.addChosen(chosen));
      }
      return _results;
    };

    Velge.prototype.inject = function() {
      this.$wrapper = $(this.wrapTemplate);
      this.$list = $('.velge-list', this.$wrapper);
      this.$dropdown = $('.velge-dropdown', this.$wrapper);
      this.$container.append(this.$wrapper);
      return this;
    };

    Velge.prototype.addChosen = function(choice) {
      this._push(choice, true);
      this._renderChosen();
      return this;
    };

    Velge.prototype.addChoice = function(choice) {
      this._push(choice);
      this._renderChoices();
      return this;
    };

    Velge.prototype._renderChosen = function() {
      var choice, choices;
      choices = (function() {
        var _i, _len, _ref, _results;
        _ref = this._choices;
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
        _ref = this._choices;
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

    Velge.prototype._push = function(choice, isChosen) {
      if (isChosen == null) {
        isChosen = false;
      }
      choice.chosen = isChosen;
      if (this._choiceMap[choice.name] == null) {
        this._choices.push(choice);
        this._choiceMap[choice.name] = choice;
        return this._choices = this._choices.sort(function(a, b) {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        });
      }
    };

    return Velge;

  })();

}).call(this);
