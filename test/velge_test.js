(function() {
  describe('Velge.Store', function() {
    describe('#length', function() {
      return it('counts choices with a filter', function() {
        var store;
        store = new Velge.Store().push({
          name: 'Apple'
        }).push({
          name: 'Kiwi'
        }, true).push({
          name: 'Orange'
        });
        expect(store.length()).to.eq(2);
        return expect(store.length(true)).to.eq(3);
      });
    });
    return describe('#cycle', function() {
      it('iterates the selected index', function() {
        var store;
        store = new Velge.Store().push({
          name: 'Apple'
        }).push({
          name: 'Kiwi'
        }).push({
          name: 'Orange'
        });
        store.cycle();
        expect(store.selected().name).to.eq('Apple');
        store.cycle();
        expect(store.selected().name).to.eq('Kiwi');
        store.cycle();
        store.cycle();
        return expect(store.selected().name).to.eq('Apple');
      });
      return it('skips over chosen objects', function() {
        var store;
        store = new Velge.Store().push({
          name: 'Apple'
        }).push({
          name: 'Kiwi'
        }, true).push({
          name: 'Orange'
        });
        store.cycle();
        store.cycle();
        return expect(store.selected().name).to.eq('Orange');
      });
    });
  });

  describe('Velge', function() {
    var $container, press, template, velge;
    press = function($input, name) {
      var key;
      key = (function() {
        switch (name) {
          case 'backspace':
            return 8;
          case 'tab':
            return 9;
          case 'enter':
            return 13;
          case 'escape':
            return 27;
          case 'space':
            return 32;
          case 'up':
            return 38;
          case 'down':
            return 40;
          case ',':
            return 188;
        }
      })();
      return $input.trigger($.Event('keydown', {
        which: key
      }));
    };
    velge = null;
    $container = null;
    template = '<div class="container"></div>';
    beforeEach(function() {
      return $container = $(template).appendTo($('#sandbox'));
    });
    afterEach(function() {
      return $('#sandbox').empty();
    });
    describe('#setup', function() {
      it('returns the instance for chaining', function() {
        velge = new Velge($container);
        return expect(velge.setup()).to.be(velge);
      });
      return it('injects the velge structure into the container', function() {
        velge = new Velge($container).setup();
        expect($container).to.have('.velge');
        expect($container).to.have('.velge-list');
        expect($container).to.have('.velge-input');
        expect($container).to.have('.velge-trigger');
        return expect($container).to.have('.velge-dropdown');
      });
    });
    describe('#setup', function() {
      return it('renders all provided choices', function() {
        velge = new Velge($container, {
          chosen: [
            {
              name: 'Apple'
            }, {
              name: 'Melon'
            }
          ],
          choices: [
            {
              name: 'Banana'
            }
          ]
        }).setup();
        expect($('.velge-list', $container)).to.contain('Apple');
        expect($('.velge-list', $container)).to.contain('Melon');
        return expect($('.velge-dropdown', $container)).to.contain('Banana');
      });
    });
    describe('#addChoice', function() {
      beforeEach(function() {
        return velge = new Velge($container).setup();
      });
      it('preopulates the dropdown menu with supplied choices', function() {
        velge.addChoice({
          name: 'Banana'
        });
        return expect($('.velge-dropdown', $container)).to.contain('Banana');
      });
      it('maintains choices in alphabetical order', function() {
        velge.addChoice({
          name: 'Watermelon'
        }).addChoice({
          name: 'Banana'
        }).addChoice({
          name: 'Kiwi'
        });
        expect($('.velge-dropdown li', $container).eq(0).text()).to.contain('Banana');
        expect($('.velge-dropdown li', $container).eq(1).text()).to.contain('Kiwi');
        return expect($('.velge-dropdown li', $container).eq(2).text()).to.contain('Watermelon');
      });
      it('does not display duplicate choices', function() {
        velge.addChoice({
          name: 'Fig'
        }).addChoice({
          name: 'Fig'
        });
        return expect($('.velge-dropdown li', $container).length).to.eq(1);
      });
      return it('does not display choices that have been chosen', function() {
        velge.addChosen({
          name: 'Fig'
        }).addChosen({
          name: 'Grape'
        }).addChoice({
          name: 'Fig'
        }).addChoice({
          name: 'Peach'
        });
        return expect($('.velge-dropdown', $container)).to.not.contain('Fig');
      });
    });
    describe('#addChosen', function() {
      beforeEach(function() {
        return velge = new Velge($container).setup();
      });
      return it('populates the chosen list with supplied tags', function() {
        velge.addChosen({
          name: 'Apple'
        });
        return expect($('.velge-list', $container)).to.contain('Apple');
      });
    });
    describe('#remChoice', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          choices: [
            {
              name: 'Apple'
            }
          ]
        }).setup();
      });
      return it('removes the choice', function() {
        velge.remChoice({
          name: 'Apple'
        });
        return expect($('.velge-dropdown', $container)).to.not.contain('Apple');
      });
    });
    describe('#remChosen', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          chosen: [
            {
              name: 'Apple'
            }
          ]
        }).setup();
      });
      return it('removes the chosen status, returning it to the list of choices', function() {
        velge.remChosen({
          name: 'Apple'
        });
        expect($('.velge-list', $container)).to.not.contain('Apple');
        return expect($('.velge-dropdown', $container)).to.contain('Apple');
      });
    });
    describe('$dropdown', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          choices: [
            {
              name: 'Apple'
            }
          ]
        }).setup();
      });
      it('opens the dropdown when down is pressed', function() {
        var $dropdown, $input;
        $input = $('.velge-input', $container);
        $dropdown = $('.velge-dropdown', $container);
        press($input, 'down');
        return expect($dropdown).to.have["class"]('open');
      });
      it('opens the dropdown on trigger click', function() {
        var $dropdown, $trigger;
        $trigger = $('.velge-trigger', $container);
        $dropdown = $('.velge-dropdown', $container);
        $trigger.trigger('click');
        return expect($dropdown).to.have["class"]('open');
      });
      it('does not open the dropdown when down is pressed', function() {
        var $dropdown, $input, $trigger;
        velge.remChoice({
          name: 'Apple'
        });
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        $dropdown = $('.velge-dropdown', $container);
        press($input, 'down');
        expect($dropdown).to.not.have["class"]('open');
        $trigger.trigger('click');
        return expect($dropdown).to.not.have["class"]('open');
      });
      it('closes the dropdown on input blur', function() {
        var $dropdown, $input, $trigger;
        $dropdown = $('.velge-dropdown', $container);
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        $trigger.trigger('click');
        $input.trigger($.Event('blur'));
        return expect($dropdown).to.not.have["class"]('open');
      });
      return it('closes on escape', function() {
        var $dropdown, $input, $trigger;
        $dropdown = $('.velge-dropdown', $container);
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        $trigger.trigger('click');
        press($input, 'escape');
        return expect($dropdown).to.not.have["class"]('open');
      });
    });
    describe('$input', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          chosen: [
            {
              name: 'Apple'
            }
          ]
        }).setup();
      });
      return it('clears the input on escape', function() {
        var $input;
        $input = $('.velge-input', $container);
        $input.val('apple');
        press($input, 'escape');
        return expect($input).to.have.value('');
      });
    });
    return describe('highlighting', function() {
      var $dropdown, $input, $trigger;
      $dropdown = null;
      $trigger = null;
      $input = null;
      beforeEach(function() {
        velge = new Velge($container, {
          choices: [
            {
              name: 'Apple'
            }, {
              name: 'Kiwi'
            }, {
              name: 'Orange'
            }
          ]
        }).setup();
        $dropdown = $('.velge-dropdown', $container);
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        return $trigger.trigger('click');
      });
      it('does not highlight anything when the dropdown is opened', function() {
        return expect($dropdown).to.not.have('.highlighted');
      });
      it('cycles the highlight down through choices', function() {
        press($input, 'down');
        expect($('.highlighted', $dropdown)).to.have.text('Apple');
        press($input, 'down');
        return expect($('.highlighted', $dropdown)).to.have.text('Kiwi');
      });
      return it('cycles the highlight up through choices', function() {
        press($input, 'up');
        expect($('.highlighted', $dropdown)).to.have.text('Kiwi');
        press($input, 'up');
        return expect($('.highlighted', $dropdown)).to.have.text('Apple');
      });
    });
  });

}).call(this);
