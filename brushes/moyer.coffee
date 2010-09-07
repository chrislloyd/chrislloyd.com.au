Artist.add (color, focus) ->
  size = 200 + rand(200)
  width = 1 + rand(3)
  step = 10 + rand(10)
  c = {x: @width*0.5, y: @height*0.5}
  for i in [0..size] by step
    x = c.x + (focus.x - c.x)*(1 - (i/size))
    y = c.y + (focus.y - c.y)*(1 - (i/size))
    @circle(x, y, i).attr({
      stroke: color
      'stroke-width': width
    })
