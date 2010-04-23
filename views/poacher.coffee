# Ruby rand
rand: (n) -> Math.floor(Math.random()*n)
Array.prototype.pick: -> @[rand(@length)]
delay: (time, fn) -> setTimeout(fn, time)

window.Art: Art: {
  width: 960,
  height: 320,
  visibleWidth: 700

  colors: ['#FFFFFF', '#9900CC', '#0066CC', '#FFFF00', '#33CC99', '#FF6633']

  works: []
  add: (fn) ->
    @works.push fn

  shift: ->
    $(@paper.canvas).css('marginTop', - (@height - @visibleHeight)*0.5)

  clear: -> @paper.clear()

  draw: ->
    @bg: @paper.rect(0,0,@width,@height).attr({
      fill: @colors.pick()
      stroke: 'none'
      opacity: Math.random()
    })
    focus: {
      x: (@width-@visibleWidth)*0.5 + rand(@visibleWidth)
      y: (@height-@visibleHeight)*0.5 + rand(@visibleHeight)
    }
    for i in [0...4+rand(4)]
      @works[rand(@works.length)].call(@paper, @colors.pick(), focus)
}

# Forces evaluation
for tag in document.getElementsByTagName('script') when tag.type is 'text/x-artwork'
  eval(CoffeeScript.compile(tag.innerHTML))

$(document).ready ->
  frame: $('#frame')
  reload: frame.find('a.reload')
  Art.visibleHeight: frame.height()
  Art.paper: Raphael 'art', Art.width, Art.height
  Art.shift()
  Art.draw()

  reload.click ->
    Art.clear()
    frame.find('.grain').css 'backgroundPosition', "${rand(100)}px ${rand(100)}px"
    _gaq.push(['_trackEvent', 'art', 'refreshed']) if _gaq?
    Art.draw()
    false
