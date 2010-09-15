# Ruby rand
rand = (n) -> Math.floor(Math.random()*n)
Array.prototype.pick = -> @[rand(@length)]
delay = (time, fn) -> setTimeout(fn, time)

window.Artist = class Artist
  @brushes = []
  @add = (fn) ->
    @brushes.push fn

  constructor = (element, width, height, visibleWidth, visibleHeight)->
    @elm = element
    @width = width
    @height = height
    @visibleWidth = visibleWidth
    @visibleHeight = visibleHeight
    @paper = Raphael @elm[0], @width, @height

    $(@paper.canvas).css {
      left: -0.5 * (@width - @visibleWidth)
      top:  -0.5 * (@height - @visibleHeight)
    }

  backgrounds = ['#EEE', '#036']
  colors = ['#FFF', '#06C', '#F33', '#003']

  clear = ->
    @paper.clear()

  draw = ->
    console.log @backgrounds.pick()
    @bg = @paper.rect(0,0,@width,@height).attr({
      fill: @backgrounds.pick()
      stroke: 'none'
    })
    focus = {
      x: (@width-@visibleWidth)*0.5 + rand(@visibleWidth)
      y: (@height-@visibleHeight)*0.5 + rand(@visibleHeight)
    }
    for i in [0...1+rand(3)]
      @constructor.brushes.pick().call(@paper, @colors.pick(), focus)

  # Tail recursive
  serialize = (node, tree) ->
    node ||= @paper.bottom
    tree ||= []
    tree.push [node.type, node.attrs]
    @serialize(node.next, tree) if node.next?
    tree

  load = (raw)->
    heart = @elm.parent()
    instructions = JSON.parse(raw)

    for instruction in instructions
      [type, attrs] = instruction
      obj = @paper[type]()
      obj.attr attrs

# Forces evaluation
$('script[type=text/x-brush]').each ->
  eval(CoffeeScript.compile(@innerHTML))

$(document).ready ->
  frame = $('#frame')
  options = $('#art-options')
  refresh = options.find('a.refresh')
  heart = options.find('a.heart')

  art = new Artist frame.find('#art'), 960, 320, 700, frame.height()
  art.draw()

  heart.bind 'webkitAnimationEnd', ->
    heart.removeClass('failed')

  refresh.click ->
    return false if heart.hasClass('hearting') or heart.hasClass('failed')
    art.clear()
    heart.removeClass('hearted').removeClass('failed')
    # For those reading along at home, if the grain doesn't move and you get
    # two similar images in a row it looks like a static overlay.
    frame.find('.grain').css 'backgroundPosition', "#{rand(100)}px #{rand(100)}px"
    _gaq.push(['_trackEvent', 'art', 'refreshed']) if _gaq?
    art.draw()
    false

  $('script[type=text/x-cereal-artwork]').each ->
    self = $(@)
    work = new Artist self.parent(), 900, 320, 180, 180
    work.load @innerHTML
