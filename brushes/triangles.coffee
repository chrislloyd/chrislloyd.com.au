Artist.add (color, focus) ->
  size = 20 + rand(20)
  spacing = 60 + rand(20)
  distance = (x1,y1,x2,y2) ->
    Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1, 2))
  for x in [0..@width] by spacing
    for y in [0..@height] by spacing
      opacity = ((@width*0.5) - distance(x, y, focus.x, focus.y)) / (@width*0.5)

      @path("M".concat(x, ",", y, "m0-", size * 0.58, "l", size * 0.5, ",", size * 0.87, "-", size, ",0z")).attr({
        fill: color
        stroke: 'none'
      })
