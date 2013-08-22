#= require spec_helper
#= require dscout.velge

describe 'Dscout.Velge', ->

  $element = null
  template = '<input type="text" class="original" />'

  # Helpers ###################################################################

  input    = -> $('.velge input')
  trigger  = -> $('.velge span')
  dropdown = -> $('.velge-dropdown')

  confirmHighlighted = (name) ->
    expect($(".velge-dropdown li:contains('#{name}')")).to.have.class('highlighted')

  confirmChoice = (name) ->
    expect($(".velge-dropdown li:contains('#{name}')")).to.exist

  confirmTagged = (name) ->
    expect($(".velge ul li:contains('#{name}')")).to.exist

  press = (name) ->
    key = switch name
      when 'backspace' then 8
      when 'tab'       then 9
      when 'enter'     then 13
      when 'escape'    then 27
      when 'space'     then 32
      when 'up'        then 38
      when 'down'      then 40
      when ','         then 188

    input().trigger($.Event('keydown', { which: key }))

  openDropdown = -> trigger().trigger('click')

  # Global Setup ##############################################################

  beforeEach ->
    $element = $(template).appendTo($('#konacha'))

  describe '#initialize', ->
    beforeEach -> window.velge($element)

    it 'hides the original input', ->
      window.velge($element)
      expect($element).to.be.hidden

    it 'appends an interaction container after the input', ->
      expect($('.velge')).to.exist

    it 'appends a results dropdown after the container', ->
      expect($('.velge-dropdown')).to.exist

  describe 'placeholder text', ->
    beforeEach -> velge($element)

    it 'uses the default placeholder when nothing is passed', ->
      input().attr('placeholder').should.equal('Add a tag')

    it 'uses the placeholder option when passed', ->
      velge($element, placeholder: 'Label me')
      input().attr('placeholder').should.equal('Label me')

    it 'clears the placeholder on focus', ->
      input().focus().val().should.equal('')

    it 'removes the placeholder class from the input on focus', ->
      input().focus().should.not.have.class('placeholder')

    it 'adds the placeholder class on blur', (done) ->
      input().focus()
      input().should.not.have.class('placeholder')
      input().trigger($.Event('blur'))

      expecation = -> input().should.have.class('placeholder')

      setTimeout expecation, 101

      done()

  describe 'tag population', ->
    beforeEach ->
      velge($element, {
        tags: [{ id: 1, name: 'cat' }, { id: 2, name: 'dog' }]
      })

    it 'populates the tag list with each of the tag values', ->
      confirmTagged(value) for value in ['cat', 'dog']

  describe 'choice population', ->
    beforeEach ->
      @velge = window.velge($element, {
        choices: [{ id: 1, name: 'zebra' }, { id: 2, name: 'dog' } ]
      })

    it 'preopulates the dropdown menu with choices', ->
      confirmChoice(value) for value in ['zebra', 'dog']

    it 'maintains choices in alphabetical order', ->
      zebra = $('.velge-dropdown li:contains("zebra")')
      expect($('.velge-dropdown li').last().text()).to.equal(zebra.text())

    it 'does not display used choices', ->
      @velge.add_tag({ id: 2, name: 'dog' })

      expect($('.velge-dropdown li:contains("dog")').length).to.equal(0)

  describe 'dropdown activation', ->
    describe 'with choices', ->
      beforeEach ->
        velge($element, {
          choices: [{ id: 1, name: 'cat' }, { id: 2, name: 'dog' } ]
        })

      it 'opens the dropdown when down is pressed', ->
        press('down')

        expect(dropdown().hasClass('open')).to.be.true

      it 'opens the dropdown on trigger click', ->
        openDropdown()

        expect(dropdown().hasClass('open')).to.be.true

    describe 'without any choices', ->
      beforeEach -> velge($element)

      it 'does not open the dropdown when down is pressed', ->
        press('down')

        expect(dropdown().hasClass('open')).to.be.false

      it 'does not open the dropdown on trigger click', ->
        openDropdown()

        expect(dropdown().hasClass('open')).to.be.false

  describe 'dropdown cancelation', ->
    beforeEach ->
      velge($element, { choices: [{ id: 1, name: 'cat' }] })
      openDropdown()

    it 'closes on input blur', (done) ->
      input().trigger($.Event('blur'))

      expecation = -> dropdown().hasClass('open').should.be.false
      setTimeout expecation, 101

      done()

    it 'closes on escape', ->
      press('escape')

      expect(dropdown().hasClass('open')).to.be.false

    it 'clears input on escape', ->
      input().val('taggy')
      press('escape')

      expect(input().val()).to.not.equal('taggy')

  describe 'highlighted tracking', ->
    beforeEach ->
      velge($element, {
        choices: [{ id: 1, name: 'cat' },
                  { id: 2, name: 'dog' },
                  { id: 3, name: 'moose' }]
      })

    describe 'when the dropdown is first opened', ->
      beforeEach -> openDropdown()

      it 'does not highlight anything', ->
        expect($('.highlighted').length).to.equal(0)

    describe 'when the dropdown is already open', ->
      beforeEach -> openDropdown()

      it 'cycles the highlight on down', ->
        press('down')

        confirmHighlighted('cat')

        expect($('.velge-dropdown .highlighted').length).to.equal(1)

      it 'cycles the highlight on up', ->
        press('down')
        press('down')
        press('up')

        confirmHighlighted('cat')

      it 'wraps the highlight when it hits the top', ->
        press('up')

        confirmHighlighted('dog')

  describe 'choice matching', ->
    beforeEach ->
      velge($element, {
        choices: [{ id: 1, name: 'chrome' },
                  { id: 2, name: 'mach' },
                  { id: 3, name: 'stomach' }]
      })

    it 'filters down choices on input', (done) ->
      input().val('ach')
      press('space')

      expectation = => $('.velge-dropdown li:visible').length.should.equal(2)

      setTimeout expectation, 11 # 10ms delay on filtering

      done()

    it 'sanitizes input to prevent regexp errors', (done) ->
      input().val('*+?{}')

      expect(-> press('space')).to.not.throw(Error)

      done()

    it 'shows all choices without any input', (done) ->
      press('backspace')
      expect($('.velge-dropdown li:visible').length).to.equal(3)

      done()

    it 'only cycles through matching choices', (done) ->
      input().val('mac')
      press('h')
      press('up')
      confirmHighlighted('mach')

      done()

  describe 'choice selection', ->
    beforeEach ->
      @velge = window.velge($element, {
        choices: [{ id: 1, name: 'firefox' }, { id: 2, name: 'chrome' }]
      })

    describe 'without a value', ->
      beforeEach -> input().val('')

      it 'does not add the choice to tags', ->
        press('enter')

        expect($('.velge ul li').length).to.equal(0)

    describe 'when the choice is already a tag', ->
      beforeEach ->
        @velge.add_tag({ id: 100, name: 'safari' })
        input().val('')

      it 'does not add a duplicate', (done) ->
        press('enter')
        expect($('.velge ul li').length).to.equal(1)

        done()

    describe 'with a valid choice', ->
      beforeEach -> input().val('safari')

      it 'adds the choice to tags on enter', (done) ->
        press('enter')
        confirmTagged('safari')

        done()

      it 'submits on comma entry', (done) ->
        press(',')
        confirmTagged('safari')

        done()

      it 'submits on tab entry', (done) ->
        press('tab')
        confirmTagged('safari')

        done()

      it 'clears the input', (done) ->
        press('enter')
        input().val().should.equal('')

        done()

    describe 'direct selection', ->
      clickChoice = (choice) -> $("li:contains(#{choice})").trigger('click')

      it 'adds the choice to tags', ->
        clickChoice('chrome')
        confirmTagged('chrome')

      it 'clears the input', (done) ->
        clickChoice('chrome')

        input().val().should.equal('')

        done()

  describe 'deleting tags', ->
    beforeEach ->
      @velge = window.velge($element, {
        tags: [{ id: 1, name: 'firefox' }, { id: 2, name: 'chrome' }]
      })

    describe 'clicking the remove link', ->
      selector = '.velge li:contains("firefox")'

      it 'removes the list item', ->
        $('a', selector).trigger('click')

        expect($(selector)).to.not.exist

      it 'removes the tag from the cache', ->
        $('a', selector).trigger('click')

        match = (tag for tag in @velge.tags when tag.name is 'firefox')

        expect(match.length).to.equal(0)
        expect(@velge.tags.length).to.equal(1)

  describe 'callbacks', ->
    callSpy   = null
    addSpy    = null
    removeSpy = null

    beforeEach ->
      callSpy   = sinon.spy()
      addSpy    = sinon.stub().returns(success: callSpy)
      removeSpy = sinon.spy()
      @velge     = window.velge($element, on_add: addSpy, on_remove: removeSpy)

    it 'triggers a callback on add', ->
      @velge.add_tag(id: 1, name: 'opera')

      addSpy.calledWith(name: 'opera').should.be.true
      callSpy.calledOnce.should.be.true

    it 'triggers a callback on remove', ->
      @velge.remove_tag(id: 1, name: 'opera', tagEl: $('<div />'))

      removeSpy.calledWith(id: 1, name: 'opera').should.be.true

