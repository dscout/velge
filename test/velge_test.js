(function() {
  describe('Velge.Store', function() {
    var store;
    store = null;
    describe('#normalize', function() {
      beforeEach(function() {
        return store = new Velge.Store();
      });
      it('defaults to downcasing input', function() {
        return expect(store.normalize('Apple')).to.eq('apple');
      });
      it('strips leading and trailing whitespace', function() {
        return expect(store.normalize(' apple ')).to.eq('apple');
      });
      return it('is tollerant of non-string input', function() {
        expect(store.normalize(null)).to.eq('null');
        expect(store.normalize(void 0)).to.eq('undefined');
        return expect(store.normalize(1)).to.eq('1');
      });
    });
    describe('#push', function() {
      beforeEach(function() {
        return store = new Velge.Store();
      });
      return it('normalizes names before storing', function() {
        store.push({
          name: 'Apple'
        });
        return expect(store.objects()[0].name).to.eq('apple');
      });
    });
    describe('#filter', function() {
      beforeEach(function() {
        return store = new Velge.Store().push({
          name: 'apple',
          chosen: false
        }).push({
          name: 'kiwi',
          chosen: true
        }).push({
          name: 'orange',
          chosen: false
        });
      });
      return it('filters down by the chosen property', function() {
        expect(store.filter({
          chosen: false
        }).length).to.eq(2);
        return expect(store.filter({
          chosen: true
        }).length).to.eq(1);
      });
    });
    return describe('#fuzzy', function() {
      beforeEach(function() {
        return store = new Velge.Store().push({
          name: 'apple'
        }).push({
          name: 'apricot'
        }).push({
          name: 'opples'
        });
      });
      it('finds all choices matching the query', function() {
        expect(store.fuzzy('p').length).to.eq(3);
        expect(store.fuzzy('ap').length).to.eq(2);
        expect(store.fuzzy('Ap').length).to.eq(2);
        expect(store.fuzzy('pp').length).to.eq(2);
        return expect(store.fuzzy('PP').length).to.eq(2);
      });
      it('sanitizes to prevent matching errors', function() {
        return expect(store.fuzzy('{}[]()*+').length).to.eq(0);
      });
      return it('matches all choices without any value', function() {
        expect(store.fuzzy('').length).to.eq(3);
        return expect(store.fuzzy('  ').length).to.eq(3);
      });
    });
  });

  describe('Velge.UI', function() {
    var $container, $dropdown, $input, $trigger, press, template, velge;
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
    $input = null;
    $dropdown = null;
    $trigger = null;
    template = '<div class="container"></div>';
    beforeEach(function() {
      return $container = $(template).appendTo($('#sandbox'));
    });
    afterEach(function() {
      return $('#sandbox').empty();
    });
    describe('choice dropdown', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          choices: [
            {
              name: 'apple'
            }
          ]
        }).setup();
      });
      it('opens the dropdown when down is pressed', function() {
        $input = $('.velge-input', $container);
        $dropdown = $('.velge-dropdown', $container);
        press($input, 'down');
        return expect($dropdown).to.have["class"]('open');
      });
      it('opens the dropdown on trigger click', function() {
        $trigger = $('.velge-trigger', $container);
        $dropdown = $('.velge-dropdown', $container);
        $trigger.trigger('click');
        return expect($dropdown).to.have["class"]('open');
      });
      it('does not open the dropdown when down is pressed', function() {
        velge.remChoice({
          name: 'apple'
        });
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        $dropdown = $('.velge-dropdown', $container);
        press($input, 'down');
        expect($dropdown).to.not.have["class"]('open');
        $trigger.trigger('click');
        return expect($dropdown).to.not.have["class"]('open');
      });
      it('closes the dropdown on input blur', function(done) {
        this.slow(200);
        $dropdown = $('.velge-dropdown', $container);
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        $trigger.trigger('click');
        $input.trigger($.Event('blur'));
        return setTimeout((function() {
          expect($dropdown).to.not.have["class"]('open');
          return done();
        }), 76);
      });
      return it('closes on escape', function() {
        $dropdown = $('.velge-dropdown', $container);
        $input = $('.velge-input', $container);
        $trigger = $('.velge-trigger', $container);
        $trigger.trigger('click');
        press($input, 'escape');
        return expect($dropdown).to.not.have["class"]('open');
      });
    });
    describe('clearing input', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          chosen: [
            {
              name: 'apple'
            }
          ]
        }).setup();
      });
      return it('clears the input on escape', function() {
        $input = $('.velge-input', $container);
        $input.val('apple');
        press($input, 'escape');
        return expect($input).to.have.value('');
      });
    });
    describe('highlighting', function() {
      beforeEach(function() {
        velge = new Velge($container, {
          choices: [
            {
              name: 'apple'
            }, {
              name: 'kiwi'
            }, {
              name: 'orange'
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
        expect($('.highlighted', $dropdown)).to.have.text('apple');
        press($input, 'down');
        return expect($('.highlighted', $dropdown)).to.have.text('kiwi');
      });
      return it('cycles the highlight up through choices', function() {
        press($input, 'up');
        expect($('.highlighted', $dropdown)).to.have.text('kiwi');
        press($input, 'up');
        return expect($('.highlighted', $dropdown)).to.have.text('apple');
      });
    });
    describe('choice selection', function() {
      beforeEach(function() {
        velge = new Velge($container, {
          choices: [
            {
              name: 'apple'
            }, {
              name: 'kiwi'
            }, {
              name: 'orange'
            }
          ]
        }).setup();
        return $('.velge-trigger', $container).trigger('click');
      });
      return it('clicking marks a choice as chosen', function() {
        var $list;
        $dropdown = $('.velge-dropdown', $container);
        $list = $('.velge-list', $container);
        $('li:contains(kiwi)', $container).click();
        expect($dropdown).to.not.contain('kiwi');
        expect($list).to.contain('kiwi');
        return expect($dropdown).to.not.have["class"]('open');
      });
    });
    describe('choice matching', function() {
      beforeEach(function() {
        velge = new Velge($container, {
          choices: [
            {
              name: 'apple'
            }, {
              name: 'apricot'
            }, {
              name: 'orange'
            }
          ]
        }).setup();
        return $input = $('.velge-input', $container);
      });
      return it('filters down choices on input', function(done) {
        $input.val('ap');
        press($input, 'space');
        return setTimeout((function() {
          expect($('.velge-dropdown li:visible').length).to.eq(2);
          return done();
        }), 11);
      });
    });
    return describe('removing chosen', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          chosen: [
            {
              name: 'apple'
            }, {
              name: 'apricot'
            }, {
              name: 'orange'
            }
          ]
        }).setup();
      });
      return it('removes the choice from the chosen list', function() {
        var $list;
        $list = $('.velge-list', $container);
        $dropdown = $('.velge-dropdown', $container);
        $('li:contains(apple) .remove', $list).click();
        expect($list).to.not.contain('apple');
        return expect($dropdown).to.contain('apple');
      });
    });
  });

  describe('Velge', function() {
    var $container, template, velge;
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
      it('injects the velge structure into the container', function() {
        velge = new Velge($container).setup();
        expect($container).to.have('.velge');
        expect($container).to.have('.velge-list');
        expect($container).to.have('.velge-input');
        expect($container).to.have('.velge-trigger');
        return expect($container).to.have('.velge-dropdown');
      });
      return it('renders all provided choices', function() {
        velge = new Velge($container, {
          chosen: [
            {
              name: 'apple'
            }, {
              name: 'melon'
            }
          ],
          choices: [
            {
              name: 'banana'
            }
          ]
        }).setup();
        expect($('.velge-list', $container)).to.contain('apple');
        expect($('.velge-list', $container)).to.contain('melon');
        return expect($('.velge-dropdown', $container)).to.contain('banana');
      });
    });
    describe('#addChoice', function() {
      beforeEach(function() {
        return velge = new Velge($container).setup();
      });
      it('preopulates the dropdown menu with supplied choices', function() {
        velge.addChoice({
          name: 'banana'
        });
        return expect($('.velge-dropdown', $container)).to.contain('banana');
      });
      it('maintains choices in alphabetical order', function() {
        velge.addChoice({
          name: 'watermelon'
        }).addChoice({
          name: 'banana'
        }).addChoice({
          name: 'kiwi'
        });
        expect($('.velge-dropdown li', $container).eq(0).text()).to.contain('banana');
        expect($('.velge-dropdown li', $container).eq(1).text()).to.contain('kiwi');
        return expect($('.velge-dropdown li', $container).eq(2).text()).to.contain('watermelon');
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
          name: 'apple'
        });
        return expect($('.velge-list', $container)).to.contain('apple');
      });
    });
    describe('#remChoice', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          choices: [
            {
              name: 'apple'
            }
          ]
        }).setup();
      });
      return it('removes the choice', function() {
        velge.remChoice({
          name: 'apple'
        });
        return expect($('.velge-dropdown', $container)).to.not.contain('apple');
      });
    });
    return describe('#remChosen', function() {
      beforeEach(function() {
        return velge = new Velge($container, {
          chosen: [
            {
              name: 'apple'
            }
          ]
        }).setup();
      });
      return it('removes the chosen status, returning it to the list of choices', function() {
        velge.remChosen({
          name: 'apple'
        });
        expect($('.velge-list', $container)).to.not.contain('apple');
        return expect($('.velge-dropdown', $container)).to.contain('apple');
      });
    });
  });

}).call(this);
